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
      const rawPassword = String(body.password || '');
      const pwdHash = sha256(rawPassword);

      const user = state.users.find(u =>
        !u.deleted_at &&
        (u.email.toLowerCase() === rawEmailOrKey || u.key === rawEmailOrKey || u.email.split('@')[0].toLowerCase() === rawEmailOrKey)
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
        success: true,
        requires_2fa_verification: false,
        user: {
          id: user.id,
          key: user.key || user.email.split('@')[0],
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

    return res.status(400).json({ success: false, error: 'Ação inválida em /api/auth.' });
  } catch (err) {
    console.error('Erro em /api/auth:', err);
    return res.status(500).json({ success: false, error: err.message || 'Erro interno no servidor de autenticação.' });
  }
}
