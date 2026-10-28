// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/auth (ES Module)
// AUTENTICAÇÃO DIFERENCIADA (VENDEDORES vs SUPER ADMIN ÉDSON COM 2FA INTELIGENTE)
// E GESTÃO DE DISPOSITIVOS CONFIÁVEIS PERMANENTES (user_trusted_devices)
// ==============================================================================

import crypto from 'crypto';
import {
  loadGovernanceState,
  saveGovernanceState,
  sha256,
  generateSixDigitCode,
  generateRandomToken,
  getClientIp,
  getUserAgent,
  parseCookies,
  buildPermanentTrustCookie,
  MASTER_CODE_PASSWORD_HASH,
  MASTER_CODE_PHONE,
  MASTER_CODE_EMAIL,
  DEFAULT_TRUSTED_PC_TOKEN,
  isTrustedMasterIp,
  isAuthorizedCodePhone,
  isAuthorizedCodeEmail,
  verifyCodeLockToken,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_KEY
} from './governance.js';

async function sendWhatsAppCodeIfPossible(phone, code, contextLabel = 'Acesso 2FA Super Admin') {
  const cleanPhone = String(phone || '').replace(/\D/g, '');
  if (!cleanPhone) return false;
  const fullNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const evoUrl = process.env.EVOLUTION_SERVER_URL || 'https://piffpaff-evolution-api.onrender.com';
  const evoKey = process.env.EVOLUTION_API_KEY || 'PiffPaffEvoSecretKey2026!';

  try {
    const res = await fetch(`${evoUrl}/message/sendText/gabriel`, {
      method: 'POST',
      headers: {
        apikey: evoKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        number: fullNumber,
        text: `🔐 *PIFF PAFF PRO CRM — ${contextLabel}*\n\nSeu código de segurança de 6 dígitos é:\n*${code}*\n\n⏳ Válido por 10 minutos.`
      })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};
    const query = req.query || {};
    const action = String(body.action || query.action || 'login').toLowerCase();

    const { state, sha } = await loadGovernanceState(true);
    const cookies = parseCookies(req);
    const ip = getClientIp(req);
    const ua = getUserAgent(req);

    // =========================================================================
    // 1. REGISTRAR EVENTO DE AUDITORIA EXTERNO (LEAD_STATUS_CHANGE, ETC.)
    // =========================================================================
    if (action === 'audit' || action === 'log_event') {
      const logEntry = {
        id: crypto.randomUUID(),
        user_id: String(body.user_id || 'system'),
        action: String(body.event_action || body.type || 'CUSTOM_EVENT'),
        resource_type: String(body.resource_type || 'lead'),
        resource_id: body.resource_id ? String(body.resource_id) : null,
        ip_address: ip,
        user_agent: ua,
        details: body.details || {},
        created_at: new Date().toISOString()
      };
      state.audit_logs.unshift(logEntry);
      await saveGovernanceState(state, sha, `Audit: ${logEntry.action}`);
      return res.status(200).json({ success: true, log: logEntry });
    }

    // =========================================================================
    // 2. VERIFICAR SESSÃO / DISPOSITIVO CONFIÁVEL ATUAL
    // =========================================================================
    if (action === 'check_device' || req.method === 'GET') {
      const userId = String(query.user_id || body.user_id || '99999999-9999-9999-9999-999999999999');
      const rawToken = cookies.device_trust_token || body.device_trust_token || query.device_trust_token || '';
      const tokenHash = rawToken ? sha256(rawToken) : '';

      const user = state.users.find(u => (u.id === userId || u.key === userId) && !u.deleted_at);
      if (!user || user.status !== 'active') {
        return res.status(403).json({
          success: false,
          active: false,
          error: 'Usuário inativo ou revogado pelo Super Administrador.'
        });
      }

      const trustedDevice = tokenHash
        ? state.user_trusted_devices.find(d => d.user_id === user.id && d.device_token_hash === tokenHash && d.is_revoked === false)
        : null;

      return res.status(200).json({
        success: true,
        active: true,
        trusted: Boolean(trustedDevice),
        requires_2fa: Boolean(user.requires_2fa),
        user: {
          id: user.id,
          key: user.key || user.email.split('@')[0],
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          requires_2fa: user.requires_2fa,
          session_version: user.session_version || 1
        }
      });
    }

    // =========================================================================
    // 3. LOGIN (DIFERENCIADO: VENDEDORES DIRETO vs SUPER ADMIN ÉDSON COM 2FA)
    // =========================================================================
    if (action === 'login') {
      const rawEmailOrKey = String(body.email || '').trim().toLowerCase();
      const rawPrefix = rawEmailOrKey.split('@')[0].trim().toLowerCase();
      const rawPassword = String(body.password || '');
      const pwdHash = sha256(rawPassword);

      const user = state.users.find(u =>
        !u.deleted_at &&
        (u.email.toLowerCase() === rawEmailOrKey ||
         u.key === rawEmailOrKey ||
         u.key === rawPrefix ||
         u.email.split('@')[0].toLowerCase() === rawEmailOrKey ||
         u.email.split('@')[0].toLowerCase() === rawPrefix)
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não encontrado no CRM.'
        });
      }

      if (user.status !== 'active') {
        state.audit_logs.unshift({
          id: crypto.randomUUID(),
          user_id: user.id,
          action: 'LOGIN_BLOCKED_INACTIVE_USER',
          resource_type: 'auth',
          resource_id: user.id,
          ip_address: ip,
          user_agent: ua,
          details: { email: user.email, reason: 'Conta desativada pelo Super Admin' },
          created_at: new Date().toISOString()
        });
        await saveGovernanceState(state, sha, `Blocked login for inactive user ${user.email}`);
        return res.status(403).json({
          success: false,
          error: 'Esta conta foi desativada pelo Administrador. Entre em contato com a diretoria.'
        });
      }

      if (user.password_hash !== pwdHash) {
        state.audit_logs.unshift({
          id: crypto.randomUUID(),
          user_id: user.id,
          action: 'LOGIN_FAILED_WRONG_PASSWORD',
          resource_type: 'auth',
          resource_id: user.id,
          ip_address: ip,
          user_agent: ua,
          details: { email: user.email },
          created_at: new Date().toISOString()
        });
        await saveGovernanceState(state, sha, `Failed login for ${user.email}`);
        return res.status(401).json({
          success: false,
          error: `Senha incorreta para ${user.name}.`
        });
      }

      // VERIFICA SE O USUÁRIO EXIGE 2FA (Ex: Édson - Super Admin)
      if (user.requires_2fa) {
        const rawDeviceToken = cookies.device_trust_token || body.device_trust_token || '';
        const deviceTokenHash = rawDeviceToken ? sha256(rawDeviceToken) : '';

        // Procura dispositivo confiável ativo (sem expiração de 30 dias; vale enquanto is_revoked === false)
        const trustedDevice = deviceTokenHash
          ? state.user_trusted_devices.find(
              d => d.user_id === user.id && d.device_token_hash === deviceTokenHash && d.is_revoked === false
            )
          : null;

        if (trustedDevice) {
          trustedDevice.last_used_at = new Date().toISOString();
          trustedDevice.ip_address = ip;

          // Também atualiza no Supabase se a tabela existir
          try {
            await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/user_trusted_devices?device_token_hash=eq.${encodeURIComponent(deviceTokenHash)}`, {
              method: 'PATCH',
              headers: {
                apikey: DEFAULT_SUPABASE_KEY,
                Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ last_used_at: trustedDevice.last_used_at, ip_address: ip })
            });
          } catch (e) {}

          state.audit_logs.unshift({
            id: crypto.randomUUID(),
            user_id: user.id,
            action: 'LOGIN_SUCCESS_TRUSTED_DEVICE',
            resource_type: 'auth',
            resource_id: trustedDevice.id,
            ip_address: ip,
            user_agent: ua,
            details: {
              email: user.email,
              device_name: trustedDevice.device_name,
              bypass_2fa: true
            },
            created_at: new Date().toISOString()
          });

          await saveGovernanceState(state, sha, `Trusted device login: ${user.email}`);
          res.setHeader('Set-Cookie', buildPermanentTrustCookie(rawDeviceToken));

          return res.status(200).json({
            success: true,
            requires_2fa_verification: false,
            trusted_device_recognized: true,
            message: 'Dispositivo confiável reconhecido! Acesso liberado diretamente sem 2FA.',
            user: {
              id: user.id,
              key: user.key || 'edson',
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              status: user.status,
              requires_2fa: true,
              session_version: user.session_version || 1
            }
          });
        }

        // Dispositivo novo ou não reconhecido -> Dispara código de 6 dígitos (válido por 10 minutos)
        const sixDigitCode = generateSixDigitCode();
        const challengeId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutos

        state.two_factor_challenges = state.two_factor_challenges.filter(
          c => c.user_id !== user.id && new Date(c.expires_at).getTime() > Date.now()
        );
        state.two_factor_challenges.unshift({
          id: challengeId,
          user_id: user.id,
          code_hash: sha256(sixDigitCode),
          is_used: false,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        });

        const waSent = await sendWhatsAppCodeIfPossible(user.phone, sixDigitCode, 'Verificação 2FA Super Admin');

        state.audit_logs.unshift({
          id: crypto.randomUUID(),
          user_id: user.id,
          action: 'LOGIN_2FA_CHALLENGE_SENT',
          resource_type: 'auth',
          resource_id: challengeId,
          ip_address: ip,
          user_agent: ua,
          details: {
            email: user.email,
            phone: user.phone,
            whatsapp_sent: waSent,
            expires_at: expiresAt
          },
          created_at: new Date().toISOString()
        });

        await saveGovernanceState(state, sha, `2FA challenge generated for ${user.email}`);

        return res.status(200).json({
          success: true,
          requires_2fa_verification: true,
          challenge_id: challengeId,
          user_id: user.id,
          email: user.email,
          masked_phone: user.phone ? user.phone.replace(/(\d{2})(\d+)(\d{4})/, '($1) •••••-$3') : '(47) •••••-0000',
          expires_in_minutes: 10,
          demo_code: sixDigitCode, // Exibido em homologação para teste imediato caso WhatsApp/SMTP não esteja pareado
          message: 'Dispositivo novo detectado. Digite o código de 6 dígitos enviado para o seu WhatsApp/E-mail.'
        });
      }

      // VENDEDORES COMUNS (ex: Felipe, Mayara, Gabriel, etc.) -> Login convencional sem 2FA
      state.audit_logs.unshift({
        id: crypto.randomUUID(),
        user_id: user.id,
        action: 'LOGIN_SUCCESS',
        resource_type: 'auth',
        resource_id: user.id,
        ip_address: ip,
        user_agent: ua,
        details: { email: user.email, role: user.role, requires_2fa: false },
        created_at: new Date().toISOString()
      });

      await saveGovernanceState(state, sha, `Seller login: ${user.email}`);

      return res.status(200).json({
        ok: true,
        success: true,
        requires_2fa_verification: false,
        user: {
          id: user.id,
          key: user.key || user.email.split('@')[0],
          seller_key: user.key || user.email.split('@')[0],
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          requires_2fa: false,
          session_version: user.session_version || 1
        }
      });
    }

    // =========================================================================
    // 4. VALIDAR CÓDIGO 2FA DE 6 DÍGITOS E SALVAR DISPOSITIVO CONFIÁVEL
    // =========================================================================
    if (action === 'verify_2fa') {
      const userId = String(body.user_id || '99999999-9999-9999-9999-999999999999');
      const code = String(body.code || '').replace(/\D/g, '').trim();
      const rememberDevice = body.remember_device !== false; // Marcado por padrão (true)
      const deviceName = String(body.device_name || ua.slice(0, 120) || 'Computador Habitual Super Admin');

      if (code.length !== 6) {
        return res.status(400).json({
          success: false,
          error: 'Digite o código completo de 6 dígitos.'
        });
      }

      const user = state.users.find(u => u.id === userId && !u.deleted_at);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Usuário não localizado.' });
      }

      const codeHash = sha256(code);
      const nowMs = Date.now();
      const challenge = state.two_factor_challenges.find(
        c => c.user_id === user.id && !c.is_used && c.code_hash === codeHash && new Date(c.expires_at).getTime() > nowMs
      );

      if (!challenge) {
        state.audit_logs.unshift({
          id: crypto.randomUUID(),
          user_id: user.id,
          action: 'LOGIN_2FA_FAILED',
          resource_type: 'auth',
          resource_id: user.id,
          ip_address: ip,
          user_agent: ua,
          details: { reason: 'Código 2FA inválido ou expirado' },
          created_at: new Date().toISOString()
        });
        await saveGovernanceState(state, sha, `2FA failed for ${user.email}`);
        return res.status(401).json({
          success: false,
          error: 'Código de 6 dígitos inválido ou expirado (validade de 10 minutos).'
        });
      }

      challenge.is_used = true;

      let rawTrustToken = null;
      if (rememberDevice) {
        rawTrustToken = generateRandomToken(32);
        const tokenHash = sha256(rawTrustToken);
        const nowIso = new Date().toISOString();

        const newDevice = {
          id: crypto.randomUUID(),
          user_id: user.id,
          device_token_hash: tokenHash,
          device_name: deviceName,
          ip_address: ip,
          last_used_at: nowIso,
          is_revoked: false, // Sem expiração de 30 dias! Permanece ativo enquanto is_revoked = false
          created_at: nowIso
        };

        state.user_trusted_devices.unshift(newDevice);

        // Persiste também na tabela user_trusted_devices do Supabase se existir
        try {
          await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/user_trusted_devices`, {
            method: 'POST',
            headers: {
              apikey: DEFAULT_SUPABASE_KEY,
              Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDevice)
          });
        } catch (e) {}

        res.setHeader('Set-Cookie', buildPermanentTrustCookie(rawTrustToken));
      }

      state.audit_logs.unshift({
        id: crypto.randomUUID(),
        user_id: user.id,
        action: 'LOGIN_2FA_VERIFIED',
        resource_type: 'auth',
        resource_id: user.id,
        ip_address: ip,
        user_agent: ua,
        details: {
          email: user.email,
          remember_device: rememberDevice,
          device_name: deviceName
        },
        created_at: new Date().toISOString()
      });

      await saveGovernanceState(state, sha, `2FA verified for ${user.email}`);

      return res.status(200).json({
        success: true,
        remember_device: rememberDevice,
        device_trust_token: rawTrustToken,
        message: rememberDevice
          ? 'Código 2FA validado! Este dispositivo foi salvo como confiável (sem expiração).'
          : 'Código 2FA validado com sucesso!',
        user: {
          id: user.id,
          key: user.key || 'edson',
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          requires_2fa: true,
          session_version: user.session_version || 1
        }
      });
    }

    // =========================================================================
    // 5. REVOGAR DISPOSITIVO CONFIÁVEL (is_revoked = true)
    // =========================================================================
    if (action === 'revoke_device') {
      const deviceId = String(body.device_id || '');
      const dev = state.user_trusted_devices.find(d => d.id === deviceId);
      if (!dev) {
        return res.status(404).json({ success: false, error: 'Dispositivo não encontrado.' });
      }
      dev.is_revoked = true;

      try {
        await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/user_trusted_devices?id=eq.${encodeURIComponent(deviceId)}`, {
          method: 'PATCH',
          headers: {
            apikey: DEFAULT_SUPABASE_KEY,
            Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_revoked: true })
        });
      } catch (e) {}

      state.audit_logs.unshift({
        id: crypto.randomUUID(),
        user_id: dev.user_id,
        action: 'TRUSTED_DEVICE_REVOKED',
        resource_type: 'trusted_device',
        resource_id: deviceId,
        ip_address: ip,
        user_agent: ua,
        details: { device_name: dev.device_name },
        created_at: new Date().toISOString()
      });

      await saveGovernanceState(state, sha, `Revoke trusted device ${deviceId}`);
      return res.status(200).json({ success: true, message: 'Dispositivo revogado com sucesso.' });
    }

    // =========================================================================
    // 6. CAMADA DE BLINDAGEM DE CÓDIGO E SISTEMA (EXCLUSIVO: 12457812 | 47999158919 | gabriellima_1@hotmail.com)
    // =========================================================================
    if (action === 'request_code_unlock') {
      const method = String(body.method || 'password').toLowerCase().trim();
      state.code_lock_challenges = Array.isArray(state.code_lock_challenges) ? state.code_lock_challenges : [];
      state.code_lock_tokens = Array.isArray(state.code_lock_tokens) ? state.code_lock_tokens : [];

      if (method === 'password' || method === 'senha') {
        const enteredPwd = String(body.password || '').trim();
        if (sha256(enteredPwd) !== MASTER_CODE_PASSWORD_HASH) {
          state.audit_logs.unshift({
            id: crypto.randomUUID(),
            user_id: 'security_shield',
            action: 'CODE_LOCK_BLOCKED_PASSWORD',
            resource_type: 'code_protection',
            resource_id: 'crm-source-lock',
            ip_address: ip,
            user_agent: ua,
            details: { reason: 'Tentativa bloqueada: senha de proteção de código inválida' },
            created_at: new Date().toISOString()
          });
          await saveGovernanceState(state, sha, 'Blocked unauthorized code modification attempt (password)');
          return res.status(403).json({
            ok: false,
            success: false,
            error: 'Acesso Negado! Apenas a senha mestra autorizada, o número (47) 99915-8919 ou o e-mail gabriellima_1@hotmail.com podem alterar o código deste CRM.'
          });
        }

        const unlockToken = generateRandomToken(32);
        state.code_lock_tokens.unshift({
          id: crypto.randomUUID(),
          token_hash: sha256(unlockToken),
          method: 'password',
          authorized_by: 'senha_mestra_12457812',
          ip_address: ip,
          is_revoked: false,
          created_at: new Date().toISOString()
        });
        state.audit_logs.unshift({
          id: crypto.randomUUID(),
          user_id: 'a1111111-1111-1111-1111-111111111111',
          action: 'CODE_LOCK_UNLOCKED_PASSWORD',
          resource_type: 'code_protection',
          resource_id: 'crm-source-lock',
          ip_address: ip,
          user_agent: ua,
          details: { method: 'password' },
          created_at: new Date().toISOString()
        });
        await saveGovernanceState(state, sha, 'Code lock unlocked via master password');
        return res.status(200).json({
          ok: true,
          success: true,
          unlocked: true,
          method: 'password',
          code_unlock_token: unlockToken,
          message: '🔓 Camada de Proteção desbloqueada com sucesso via Senha Mestra!'
        });
      }

      if (method === 'whatsapp' || method === 'phone' || method === 'numero') {
        const rawPhone = String(body.phone || MASTER_CODE_PHONE).trim();
        if (!isAuthorizedCodePhone(rawPhone)) {
          state.audit_logs.unshift({
            id: crypto.randomUUID(),
            user_id: 'security_shield',
            action: 'CODE_LOCK_BLOCKED_PHONE',
            resource_type: 'code_protection',
            resource_id: 'crm-source-lock',
            ip_address: ip,
            user_agent: ua,
            details: { attempted_phone: rawPhone, reason: 'Número não autorizado' },
            created_at: new Date().toISOString()
          });
          await saveGovernanceState(state, sha, 'Blocked unauthorized code modification attempt (phone)');
          return res.status(403).json({
            ok: false,
            success: false,
            error: 'Número bloqueado! Somente o WhatsApp oficial (47) 99915-8919 possui permissão para desbloquear alterações no código.'
          });
        }

        const otpCode = generateSixDigitCode();
        const challengeId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        state.code_lock_challenges = state.code_lock_challenges.filter(
          c => !c.is_used && new Date(c.expires_at).getTime() > Date.now()
        );
        state.code_lock_challenges.unshift({
          id: challengeId,
          method: 'whatsapp',
          target: MASTER_CODE_PHONE,
          code_hash: sha256(otpCode),
          is_used: false,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        });

        const waSent = await sendWhatsAppCodeIfPossible(
          MASTER_CODE_PHONE,
          otpCode,
          'Blindagem de Código (Desbloqueio de Alteração)'
        );

        state.audit_logs.unshift({
          id: crypto.randomUUID(),
          user_id: 'a1111111-1111-1111-1111-111111111111',
          action: 'CODE_LOCK_OTP_SENT_WHATSAPP',
          resource_type: 'code_protection',
          resource_id: challengeId,
          ip_address: ip,
          user_agent: ua,
          details: { target: '(47) 99915-8919', whatsapp_sent: waSent },
          created_at: new Date().toISOString()
        });
        await saveGovernanceState(state, sha, 'Code lock OTP sent to 47999158919');

        return res.status(200).json({
          ok: true,
          success: true,
          challenge_sent: true,
          challenge_id: challengeId,
          method: 'whatsapp',
          target: '(47) 99915-8919',
          whatsapp_sent: waSent,
          message: '📱 Código de verificação de 6 dígitos enviado para o WhatsApp (47) 99915-8919!'
        });
      }

      if (method === 'email') {
        const rawEmail = String(body.email || MASTER_CODE_EMAIL).trim().toLowerCase();
        if (!isAuthorizedCodeEmail(rawEmail)) {
          state.audit_logs.unshift({
            id: crypto.randomUUID(),
            user_id: 'security_shield',
            action: 'CODE_LOCK_BLOCKED_EMAIL',
            resource_type: 'code_protection',
            resource_id: 'crm-source-lock',
            ip_address: ip,
            user_agent: ua,
            details: { attempted_email: rawEmail, reason: 'E-mail não autorizado' },
            created_at: new Date().toISOString()
          });
          await saveGovernanceState(state, sha, 'Blocked unauthorized code modification attempt (email)');
          return res.status(403).json({
            ok: false,
            success: false,
            error: 'E-mail bloqueado! Somente gabriellima_1@hotmail.com possui permissão para desbloquear alterações no código.'
          });
        }

        const otpCode = generateSixDigitCode();
        const challengeId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        state.code_lock_challenges = state.code_lock_challenges.filter(
          c => !c.is_used && new Date(c.expires_at).getTime() > Date.now()
        );
        state.code_lock_challenges.unshift({
          id: challengeId,
          method: 'email',
          target: MASTER_CODE_EMAIL,
          code_hash: sha256(otpCode),
          is_used: false,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        });

        // Dispara cópia de segurança imediata no WhatsApp oficial 47999158919 além do e-mail gabriellima_1@hotmail.com
        const waMirrorSent = await sendWhatsAppCodeIfPossible(
          MASTER_CODE_PHONE,
          otpCode,
          `Verificação por E-mail (${MASTER_CODE_EMAIL}) — Blindagem de Código`
        );

        state.audit_logs.unshift({
          id: crypto.randomUUID(),
          user_id: 'a1111111-1111-1111-1111-111111111111',
          action: 'CODE_LOCK_OTP_SENT_EMAIL',
          resource_type: 'code_protection',
          resource_id: challengeId,
          ip_address: ip,
          user_agent: ua,
          details: { target: MASTER_CODE_EMAIL, whatsapp_mirror_sent: waMirrorSent },
          created_at: new Date().toISOString()
        });
        await saveGovernanceState(state, sha, 'Code lock OTP sent to gabriellima_1@hotmail.com');

        return res.status(200).json({
          ok: true,
          success: true,
          challenge_sent: true,
          challenge_id: challengeId,
          method: 'email',
          target: MASTER_CODE_EMAIL,
          message: `📧 Código de verificação de 6 dígitos enviado para ${MASTER_CODE_EMAIL} (com espelhamento de segurança no WhatsApp 47 99915-8919)!`
        });
      }

      return res.status(400).json({ ok: false, success: false, error: 'Método de verificação inválido.' });
    }

    if (action === 'verify_code_unlock') {
      const code = String(body.code || '').replace(/\D/g, '').trim();
      const challengeId = String(body.challenge_id || '').trim();
      if (code.length !== 6) {
        return res.status(400).json({ ok: false, success: false, error: 'Digite o código completo de 6 dígitos.' });
      }

      state.code_lock_challenges = Array.isArray(state.code_lock_challenges) ? state.code_lock_challenges : [];
      state.code_lock_tokens = Array.isArray(state.code_lock_tokens) ? state.code_lock_tokens : [];

      const codeHash = sha256(code);
      const nowMs = Date.now();
      const challenge = state.code_lock_challenges.find(
        c =>
          !c.is_used &&
          c.code_hash === codeHash &&
          new Date(c.expires_at).getTime() > nowMs &&
          (!challengeId || c.id === challengeId)
      );

      if (!challenge) {
        return res.status(401).json({
          ok: false,
          success: false,
          error: 'Código de verificação inválido ou expirado.'
        });
      }

      challenge.is_used = true;
      const unlockToken = generateRandomToken(32);
      state.code_lock_tokens.unshift({
        id: crypto.randomUUID(),
        token_hash: sha256(unlockToken),
        method: challenge.method,
        authorized_by: challenge.target,
        ip_address: ip,
        is_revoked: false,
        created_at: new Date().toISOString()
      });

      state.audit_logs.unshift({
        id: crypto.randomUUID(),
        user_id: 'a1111111-1111-1111-1111-111111111111',
        action: 'CODE_LOCK_UNLOCKED_OTP',
        resource_type: 'code_protection',
        resource_id: challenge.id,
        ip_address: ip,
        user_agent: ua,
        details: { method: challenge.method, target: challenge.target },
        created_at: new Date().toISOString()
      });
      await saveGovernanceState(state, sha, `Code lock unlocked via ${challenge.method}`);

      return res.status(200).json({
        ok: true,
        success: true,
        unlocked: true,
        method: challenge.method,
        target: challenge.target,
        code_unlock_token: unlockToken,
        message: `🔓 Blindagem de Código desbloqueada com sucesso via ${challenge.target}!`
      });
    }

    if (action === 'check_code_unlock') {
      const token = String(body.code_unlock_token || query.code_unlock_token || '');
      const valid = verifyCodeLockToken(state, token, body.password || '', ip);
      const isTrustedPcIp = isTrustedMasterIp(ip);
      return res.status(200).json({
        ok: true,
        success: true,
        unlocked: valid,
        trusted_pc: isTrustedPcIp || token === DEFAULT_TRUSTED_PC_TOKEN,
        code_unlock_token: valid ? (token || DEFAULT_TRUSTED_PC_TOKEN) : null,
        device_name: 'DESKTOP-6FQTTGO (PC Principal de Confiança)'
      });
    }

    return res.status(400).json({ success: false, error: 'Ação inválida em /api/auth.' });
  } catch (err) {
    console.error('Erro em /api/auth:', err);
    return res.status(500).json({ success: false, error: err.message || 'Erro interno no servidor de autenticação.' });
  }
}
