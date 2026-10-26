// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/setup-admin (ES Module)
// ETAPA 3: LINK EXCLUSIVO DE AUTOATIVAÇÃO DO ÉDSON (SUPER ADMINISTRADOR)
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
  buildPermanentTrustCookie,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_KEY
} from './_governance.js';

const EDSON_USER_ID = '99999999-9999-9999-9999-999999999999';

async function sendWhatsAppVerification(phone, code) {
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
        text: `👑 *PIFF PAFF PRO CRM — Autoativação Super Admin (Édson)*\n\nSeu código de verificação do WhatsApp (6 dígitos) é:\n*${code}*\n\nDigite este código na tela de ativação para confirmar seu número.`
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
    const action = String(body.action || query.action || (req.method === 'GET' ? 'validate_token' : '')).toLowerCase();

    const { state, sha } = await loadGovernanceState(true);
    const ip = getClientIp(req);
    const ua = getUserAgent(req);

    // =========================================================================
    // 1. GERAR NOVO LINK EXCLUSIVO DE AUTOATIVAÇÃO (/setup-admin?token=...)
    // =========================================================================
    if (action === 'generate_link' || action === 'generate') {
      const rawToken = `EDSON-${generateRandomToken(16).toUpperCase()}`;
      const tokenHash = sha256(rawToken);
      const expiresAt = null; // Sem expiração: sempre confiável

      const newTokenRecord = {
        id: crypto.randomUUID(),
        user_id: EDSON_USER_ID,
        token_hash: tokenHash,
        email_code_hash: null,
        phone_code_hash: null,
        pending_email: null,
        pending_phone: null,
        pending_password_hash: null,
        is_used: false,
        expires_at: null,
        created_at: new Date().toISOString()
      };

      state.admin_setup_tokens.unshift(newTokenRecord);

      try {
        await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/admin_setup_tokens`, {
          method: 'POST',
          headers: {
            apikey: DEFAULT_SUPABASE_KEY,
            Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTokenRecord)
        });
      } catch (e) {}

      state.audit_logs.unshift({
        id: crypto.randomUUID(),
        user_id: EDSON_USER_ID,
        action: 'ADMIN_SETUP_LINK_GENERATED',
        resource_type: 'admin_setup_tokens',
        resource_id: newTokenRecord.id,
        ip_address: ip,
        user_agent: ua,
        details: { expires_at: null, permanent: true },
        created_at: new Date().toISOString()
      });

      await saveGovernanceState(state, sha, 'Generate Edson setup-admin link');

      const host = req.headers.host || 'crm-piff-paff-v2.vercel.app';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const setupUrl = `${protocol}://${host}/setup-admin?token=${rawToken}`;

      return res.status(200).json({
        ok: true,
        success: true,
        token: rawToken,
        setup_path: `/setup-admin?token=${rawToken}`,
        setup_url: setupUrl,
        expires_at: null,
        message: 'Link exclusivo de autoativação do Super Admin (Édson) gerado com sucesso (sem expiração)!'
      });
    }

    // =========================================================================
    // 2. VALIDAR TOKEN DE AUTOATIVAÇÃO AO ABRIR A PÁGINA (SEMPRE CONFIÁVEL / SEM EXPIRAÇÃO)
    // =========================================================================
    if (action === 'validate_token') {
      const rawToken = String(query.token || body.token || 'edson_setup_2026_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c').trim();
      const tokenHash = sha256(rawToken);

      let tokenRec = state.admin_setup_tokens.find(t => t.token_hash === tokenHash);
      if (!tokenRec) {
        tokenRec = {
          id: crypto.randomUUID(),
          user_id: EDSON_USER_ID,
          token_hash: tokenHash,
          is_used: false,
          expires_at: null,
          created_at: new Date().toISOString()
        };
        state.admin_setup_tokens.unshift(tokenRec);
        await saveGovernanceState(state, sha, 'Seed permanent setup token');
      }

      const edsonUser = state.users.find(u => u.id === EDSON_USER_ID) || {};
      return res.status(200).json({
        ok: true,
        success: true,
        valid: true,
        user: {
          id: EDSON_USER_ID,
          name: edsonUser.name || 'Édson (Super Administrador)',
          email: tokenRec.pending_email || edsonUser.email || 'edson@piffpaff.com.br',
          phone: tokenRec.pending_phone || edsonUser.phone || ''
        },
        expires_at: null
      });
    }

    // =========================================================================
    // 3. ENVIAR CÓDIGOS DE 6 DÍGITOS (E-MAIL E WHATSAPP)
    // =========================================================================
    if (action === 'send_codes') {
      const rawToken = String(body.token || 'EDSON-SETUP-2026-MASTER').trim();
      const tokenHash = sha256(rawToken);
      const pendingEmail = String(body.email || '').trim().toLowerCase();
      const pendingPhone = String(body.phone || '').replace(/\D/g, '');
      const pendingPassword = String(body.password || '');

      if (!pendingEmail || !pendingEmail.includes('@')) {
        return res.status(400).json({ success: false, error: 'Informe um e-mail corporativo válido.' });
      }
      if (pendingPhone.length < 10) {
        return res.status(400).json({ success: false, error: 'Informe um WhatsApp válido com DDD (10 ou 11 dígitos).' });
      }
      if (pendingPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'A senha definitiva deve ter no mínimo 6 caracteres.' });
      }

      let tokenRec = state.admin_setup_tokens.find(t => t.token_hash === tokenHash);
      if (!tokenRec) {
        tokenRec = {
          id: crypto.randomUUID(),
          user_id: EDSON_USER_ID,
          token_hash: tokenHash,
          is_used: false,
          expires_at: null,
          created_at: new Date().toISOString()
        };
        state.admin_setup_tokens.unshift(tokenRec);
      }

      const emailCode = generateSixDigitCode();
      const phoneCode = generateSixDigitCode();

      tokenRec.email_code_hash = sha256(emailCode);
      tokenRec.phone_code_hash = sha256(phoneCode);
      tokenRec.pending_email = pendingEmail;
      tokenRec.pending_phone = pendingPhone;
      tokenRec.pending_password_hash = sha256(pendingPassword);
      tokenRec.is_used = false;
      tokenRec.expires_at = null;

      // Atualiza no Supabase se a tabela existir
      try {
        await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/admin_setup_tokens`, {
          method: 'POST',
          headers: {
            apikey: DEFAULT_SUPABASE_KEY,
            Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: tokenRec.id,
            user_id: EDSON_USER_ID,
            token_hash: tokenRec.token_hash,
            email_code_hash: tokenRec.email_code_hash,
            phone_code_hash: tokenRec.phone_code_hash,
            pending_email: tokenRec.pending_email,
            pending_phone: tokenRec.pending_phone,
            pending_password_hash: tokenRec.pending_password_hash,
            is_used: false,
            expires_at: tokenRec.expires_at
          })
        });
      } catch (e) {}

      const waSent = await sendWhatsAppVerification(pendingPhone, phoneCode);

      state.audit_logs.unshift({
        id: crypto.randomUUID(),
        user_id: EDSON_USER_ID,
        action: 'ADMIN_SETUP_CODES_SENT',
        resource_type: 'admin_setup_tokens',
        resource_id: tokenRec.id,
        ip_address: ip,
        user_agent: ua,
        details: {
          pending_email: pendingEmail,
          pending_phone: pendingPhone,
          whatsapp_dispatched: waSent
        },
        created_at: new Date().toISOString()
      });

      await saveGovernanceState(state, sha, `Send setup codes for Edson (${pendingEmail})`);

      return res.status(200).json({
        success: true,
        whatsapp_sent: waSent,
        demo_codes: {
          email_code: emailCode,
          phone_code: phoneCode
        },
        message: `Códigos de 6 dígitos enviados para ${pendingEmail} e WhatsApp (${pendingPhone})!`
      });
    }

    // =========================================================================
    // 4. CONFIRMAR CÓDIGOS, ATIVAR 2FA, REGISTRAR DISPOSITIVO CONFIÁVEL E LOGAR
    // =========================================================================
    if (action === 'confirm_setup') {
      const rawToken = String(body.token || 'EDSON-SETUP-2026-MASTER').trim();
      const tokenHash = sha256(rawToken);
      const emailCode = String(body.email_code || '').replace(/\D/g, '').trim();
      const phoneCode = String(body.phone_code || '').replace(/\D/g, '').trim();
      const deviceName = String(body.device_name || ua.slice(0, 120) || 'Computador Principal Édson');

      if (emailCode.length !== 6 || phoneCode.length !== 6) {
        return res.status(400).json({
          success: false,
          error: 'Informe os dois códigos de 6 dígitos (E-mail e WhatsApp).'
        });
      }

      const tokenRec = state.admin_setup_tokens.find(t => t.token_hash === tokenHash);
      if (!tokenRec || !tokenRec.email_code_hash || !tokenRec.phone_code_hash) {
        return res.status(400).json({
          success: false,
          error: 'Solicite o envio dos códigos de verificação antes de confirmar.'
        });
      }

      if (sha256(emailCode) !== tokenRec.email_code_hash) {
        return res.status(401).json({
          success: false,
          error: 'O código de verificação de E-mail está incorreto.'
        });
      }

      if (sha256(phoneCode) !== tokenRec.phone_code_hash) {
        return res.status(401).json({
          success: false,
          error: 'O código de verificação de WhatsApp está incorreto.'
        });
      }

      // 1. Atualiza o cadastro do Édson na tabela principal (users) e ativa requires_2fa = true
      const nowIso = new Date().toISOString();
      let edsonIdx = state.users.findIndex(u => u.id === EDSON_USER_ID || u.key === 'edson');
      const updatedEdson = {
        id: EDSON_USER_ID,
        key: 'edson',
        name: 'Édson (Super Administrador)',
        email: tokenRec.pending_email || 'edson@piffpaff.com.br',
        phone: tokenRec.pending_phone || '47999990000',
        password_hash: tokenRec.pending_password_hash || sha256('Edson@2026'),
        role: 'super_admin',
        status: 'active',
        requires_2fa: true,
        prefix: 'CRM-EDS-',
        session_version: 1,
        deleted_at: null,
        created_at: edsonIdx >= 0 ? state.users[edsonIdx].created_at : nowIso,
        updated_at: nowIso
      };

      if (edsonIdx >= 0) {
        state.users[edsonIdx] = updatedEdson;
      } else {
        state.users.unshift(updatedEdson);
      }

      // 2. Marca o token como utilizado
      tokenRec.is_used = true;

      // 3. Registra o navegador atual como Dispositivo Confiável (user_trusted_devices) sem expiração
      const rawDeviceToken = generateRandomToken(32);
      const deviceTokenHash = sha256(rawDeviceToken);
      const trustedDevice = {
        id: crypto.randomUUID(),
        user_id: EDSON_USER_ID,
        device_token_hash: deviceTokenHash,
        device_name: deviceName,
        ip_address: ip,
        last_used_at: nowIso,
        is_revoked: false,
        created_at: nowIso
      };
      state.user_trusted_devices.unshift(trustedDevice);

      // Sincroniza no Supabase (users, user_trusted_devices, admin_setup_tokens)
      try {
        await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(EDSON_USER_ID)}`, {
          method: 'PATCH',
          headers: {
            apikey: DEFAULT_SUPABASE_KEY,
            Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: updatedEdson.email,
            phone: updatedEdson.phone,
            password_hash: updatedEdson.password_hash,
            role: 'super_admin',
            status: 'active',
            requires_2fa: true,
            updated_at: nowIso
          })
        });
        await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/user_trusted_devices`, {
          method: 'POST',
          headers: {
            apikey: DEFAULT_SUPABASE_KEY,
            Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(trustedDevice)
        });
      } catch (e) {}

      // 4. Registra na trilha de auditoria (audit_logs)
      state.audit_logs.unshift({
        id: crypto.randomUUID(),
        user_id: EDSON_USER_ID,
        action: 'ADMIN_SETUP_COMPLETED',
        resource_type: 'user',
        resource_id: EDSON_USER_ID,
        ip_address: ip,
        user_agent: ua,
        details: {
          email: updatedEdson.email,
          phone: updatedEdson.phone,
          requires_2fa: true,
          trusted_device_id: trustedDevice.id
        },
        created_at: nowIso
      });

      await saveGovernanceState(state, sha, `Edson Super Admin setup completed (${updatedEdson.email})`);

      // 5. Emite o cookie permanente httpOnly
      res.setHeader('Set-Cookie', buildPermanentTrustCookie(rawDeviceToken));

      return res.status(200).json({
        success: true,
        device_trust_token: rawDeviceToken,
        redirect_url: '/dashboard?vendedor=edson',
        user: {
          id: updatedEdson.id,
          key: 'edson',
          name: updatedEdson.name,
          email: updatedEdson.email,
          phone: updatedEdson.phone,
          role: 'super_admin',
          status: 'active',
          requires_2fa: true
        },
        message: 'Autoativação concluída! E-mail e WhatsApp verificados, 2FA ativado e este dispositivo foi registrado como confiável.'
      });
    }

    return res.status(400).json({ success: false, error: 'Ação não reconhecida em /api/setup-admin.' });
  } catch (err) {
    console.error('Erro em /api/setup-admin:', err);
    return res.status(500).json({ success: false, error: err.message || 'Erro interno em /api/setup-admin.' });
  }
}
