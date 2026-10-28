// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/admin/users (ES Module)
// ETAPA 4: GESTÃO DE USUÁRIOS, AUDITORIA, SOFT DELETE & GOVERNANÇA DO ÉDSON
// Suporta:
// - GET /api/admin/users (Lista usuários, dispositivos confiáveis, audit_logs e lixeira soft-delete)
// - POST /api/admin/users (Cria novo vendedor com hash seguro de senha e permissão comercial restrita)
// - PATCH /api/admin/users/:id/toggle-status (Desativação instantânea com revogação de sessões ativas)
// - POST /api/admin/users { action: 'restore_lead' } (Restaura item excluído via Soft Delete - exclusivo Super Admin)
// ==============================================================================

import crypto from 'crypto';
import {
  loadGovernanceState,
  saveGovernanceState,
  sha256,
  getClientIp,
  getUserAgent,
  restoreSoftDeletedLead,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_KEY
} from './governance.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
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
    const ip = getClientIp(req);
    const ua = getUserAgent(req);

    // Extrai ID caso a rota venha como /api/admin/users/:id/toggle-status
    const urlPath = String(req.url || '');
    const toggleMatch = urlPath.match(/\/api\/admin\/users\/([^/?#]+)\/toggle-status/i);
    const targetIdFromPath = toggleMatch ? decodeURIComponent(toggleMatch[1]) : (query.id || body.id || body.user_id || '');
    const action = String(
      body.action ||
      query.action ||
      (toggleMatch || req.method === 'PATCH' ? 'toggle_status' : req.method === 'POST' ? 'create_user' : req.method === 'DELETE' ? 'soft_delete_user' : 'list')
    ).toLowerCase();

    const { state, sha } = await loadGovernanceState(true);

    // =========================================================================
    // 1. LISTAR USUÁRIOS, TRILHA DE AUDITORIA, DISPOSITIVOS E LIXEIRA SOFT DELETE
    // =========================================================================
    if (req.method === 'GET' || action === 'list') {
      const includeDeleted = query.include_deleted === 'true' || body.include_deleted === true;
      const usersList = state.users
        .filter(u => includeDeleted ? true : !u.deleted_at)
        .map(u => ({
          id: u.id,
          key: u.key || u.email.split('@')[0].toLowerCase(),
          name: u.name,
          email: u.email,
          phone: u.phone || '',
          role: u.role || 'vendedor',
          status: u.status || 'active',
          requires_2fa: Boolean(u.requires_2fa),
          prefix: u.prefix || 'CRM-USR-',
          session_version: u.session_version || 1,
          deleted_at: u.deleted_at || null,
          created_at: u.created_at,
          updated_at: u.updated_at
        }));

      const softDeletedItems = Object.values(state.soft_deleted_records || {});

      return res.status(200).json({
        ok: true,
        success: true,
        total_users: usersList.length,
        active_users: usersList.filter(u => u.status === 'active' && !u.deleted_at).length,
        users: usersList,
        trusted_devices: state.user_trusted_devices || [],
        audit_logs: (state.audit_logs || []).slice(0, 100),
        soft_deleted_records: softDeletedItems,
        soft_deleted_leads: softDeletedItems
      });
    }

    // =========================================================================
    // 2. CRIAR NOVO VENDEDOR / USUÁRIO (POST /api/admin/users)
    // =========================================================================
    if (action === 'create_user' || action === 'create') {
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const phone = String(body.phone || '').replace(/\D/g, '');
      const password = String(body.password || '').trim();
      const requestedRole = String(body.role || 'vendedor').toLowerCase().trim();
      const role = ['super_admin', 'admin', 'vendedor'].includes(requestedRole) ? requestedRole : 'vendedor';

      if (!name || !email || !email.includes('@')) {
        return res.status(400).json({
          ok: false,
          success: false,
          error: 'Nome completo e E-mail válido são obrigatórios.'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          ok: false,
          success: false,
          error: 'A senha inicial temporária deve conter no mínimo 6 caracteres.'
        });
      }

      const cleanKey = email.split('@')[0].replace(/[^a-z0-9]/g, '').toLowerCase() || `vendedor${Date.now()}`;
      const prefixCode = cleanKey.substring(0, 3).toUpperCase().padEnd(3, 'X');
      const nowIso = new Date().toISOString();
      const passwordHash = sha256(password);

      const existingUser = state.users.find(
        u => !u.deleted_at && (u.email.toLowerCase() === email || u.key === cleanKey)
      );

      let targetUser;
      if (existingUser) {
        // Se já existir (ex: clique duplo ou atualização de credenciais), atualiza sem dar erro 409!
        existingUser.name = name || existingUser.name;
        existingUser.email = email;
        existingUser.phone = phone || existingUser.phone;
        existingUser.password_hash = passwordHash;
        existingUser.role = role;
        existingUser.status = 'active';
        existingUser.deleted_at = null;
        existingUser.prefix = existingUser.prefix || `CRM-${prefixCode}-`;
        existingUser.updated_at = nowIso;
        targetUser = existingUser;
      } else {
        const newUserId = cleanKey === 'diana' ? '88888888-8888-8888-8888-888888888888' : crypto.randomUUID();
        targetUser = {
          id: newUserId,
          key: cleanKey,
          name,
          email,
          phone,
          password_hash: passwordHash,
          role,
          status: 'active',
          requires_2fa: role === 'super_admin', // Vendedores comuns entram com login convencional sem 2FA
          prefix: `CRM-${prefixCode}-`,
          session_version: 1,
          deleted_at: null,
          created_at: nowIso,
          updated_at: nowIso
        };
        state.users.push(targetUser);
      }

      // Persiste também no Supabase (tabela public.users) se existir
      try {
        await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/users`, {
          method: 'POST',
          headers: {
            apikey: DEFAULT_SUPABASE_KEY,
            Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            phone: targetUser.phone,
            password_hash: targetUser.password_hash,
            role: targetUser.role,
            status: targetUser.status,
            requires_2fa: targetUser.requires_2fa,
            prefix: targetUser.prefix,
            session_version: targetUser.session_version || 1,
            deleted_at: null,
            created_at: targetUser.created_at || nowIso,
            updated_at: nowIso
          })
        });
      } catch (e) {}

      state.audit_logs.unshift({
        id: crypto.randomUUID(),
        user_id: String(body.actor_id || '99999999-9999-9999-9999-999999999999'),
        action: existingUser ? 'USER_UPDATED' : 'USER_CREATED',
        resource_type: 'user',
        resource_id: targetUser.id,
        ip_address: ip,
        user_agent: ua,
        details: {
          name: targetUser.name,
          email: targetUser.email,
          role: targetUser.role,
          requires_2fa: targetUser.requires_2fa
        },
        created_at: nowIso
      });

      await saveGovernanceState(state, sha, `Create/Update user ${targetUser.email}`);

      return res.status(201).json({
        ok: true,
        success: true,
        message: `Usuário "${targetUser.name}" (${targetUser.role}) cadastrado e ativado com sucesso!`,
        user: {
          id: targetUser.id,
          key: targetUser.key,
          seller_key: targetUser.key,
          name: targetUser.name,
          email: targetUser.email,
          phone: targetUser.phone,
          role: targetUser.role,
          status: targetUser.status,
          requires_2fa: targetUser.requires_2fa,
          prefix: targetUser.prefix,
          created_at: targetUser.created_at
        }
      });
    }

    // =========================================================================
    // 3. ALTERNAR STATUS (ATIVAR / DESATIVAR COM REVOGAÇÃO DE SESSÕES ATIVAS)
    // PATCH /api/admin/users/:id/toggle-status
    // =========================================================================
    if (action === 'toggle_status' || action === 'togglestatus') {
      const targetId = String(targetIdFromPath || '').trim();
      if (!targetId) {
        return res.status(400).json({ success: false, error: 'ID do usuário é obrigatório.' });
      }

      const user = state.users.find(u => (u.id === targetId || u.key === targetId || u.email === targetId) && !u.deleted_at);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
      }

      if (user.role === 'super_admin' && user.status === 'active') {
        return res.status(403).json({
          success: false,
          error: 'Operação bloqueada: A conta principal do Super Administrador (Édson) não pode ser desativada.'
        });
      }

      const nowIso = new Date().toISOString();
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      user.status = newStatus;
      user.session_version = (user.session_version || 1) + 1; // Invalida sessões ativas imediatamente
      user.updated_at = nowIso;

      // Se foi desativado, revoga todos os dispositivos confiáveis ativos desse usuário
      if (newStatus === 'inactive' && Array.isArray(state.user_trusted_devices)) {
        state.user_trusted_devices.forEach(d => {
          if (d.user_id === user.id) {
            d.is_revoked = true;
          }
        });
      }

      try {
        await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(user.id)}`, {
          method: 'PATCH',
          headers: {
            apikey: DEFAULT_SUPABASE_KEY,
            Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus,
            session_version: user.session_version,
            updated_at: nowIso
          })
        });
      } catch (e) {}

      state.audit_logs.unshift({
        id: crypto.randomUUID(),
        user_id: String(body.actor_id || '99999999-9999-9999-9999-999999999999'),
        action: newStatus === 'inactive' ? 'USER_DEACTIVATED_SESSIONS_REVOKED' : 'USER_REACTIVATED',
        resource_type: 'user',
        resource_id: user.id,
        ip_address: ip,
        user_agent: ua,
        details: {
          target_user: user.name,
          target_email: user.email,
          new_status: newStatus,
          session_version: user.session_version
        },
        created_at: nowIso
      });

      await saveGovernanceState(state, sha, `Toggle user status ${user.email} -> ${newStatus}`);

      return res.status(200).json({
        ok: true,
        success: true,
        user_id: user.id,
        status: newStatus,
        session_version: user.session_version,
        message: newStatus === 'inactive'
          ? `Acesso de "${user.name}" desativado instantaneamente e sessões ativas revogadas!`
          : `Conta de "${user.name}" reativada com sucesso!`
      });
    }

    // =========================================================================
    // 4. SOFT DELETE DE USUÁRIO (deleted_at = NOW())
    // =========================================================================
    if (action === 'soft_delete_user') {
      const targetId = String(targetIdFromPath || body.id || '').trim();
      const user = state.users.find(u => u.id === targetId || u.key === targetId);
      if (!user) {
        return res.status(404).json({ ok: false, success: false, error: 'Usuário não encontrado.' });
      }
      if (user.role === 'super_admin') {
        return res.status(403).json({ ok: false, success: false, error: 'Não é permitido remover o Super Administrador.' });
      }

      const nowIso = new Date().toISOString();
      user.deleted_at = nowIso;
      user.status = 'inactive';
      user.session_version = (user.session_version || 1) + 1;

      state.soft_deleted_records[`user:${user.id}`] = {
        id: user.id,
        resource_type: 'user',
        deleted_at: nowIso,
        deleted_by: '99999999-9999-9999-9999-999999999999',
        snapshot: { id: user.id, name: user.name, email: user.email, role: user.role }
      };

      state.audit_logs.unshift({
        id: crypto.randomUUID(),
        user_id: '99999999-9999-9999-9999-999999999999',
        action: 'USER_SOFT_DELETE',
        resource_type: 'user',
        resource_id: user.id,
        ip_address: ip,
        user_agent: ua,
        details: { name: user.name, email: user.email, deleted_at: nowIso },
        created_at: nowIso
      });

      await saveGovernanceState(state, sha, `Soft delete user ${user.email}`);
      return res.status(200).json({
        ok: true,
        success: true,
        message: `Usuário "${user.name}" movido para a lixeira blindada (Soft Delete).`
      });
    }

    // =========================================================================
    // 5. RESTAURAR LEAD / REGISTRO DA LIXEIRA SOFT DELETE (EXCLUSIVO SUPER ADMIN)
    // =========================================================================
    if (action === 'restore_lead' || action === 'restore') {
      const leadId = String(body.lead_id || body.id || '').trim();
      if (!leadId) {
        return res.status(400).json({ ok: false, success: false, error: 'ID do registro para restauração é obrigatório.' });
      }
      const restored = await restoreSoftDeletedLead({
        leadId,
        actorUserId: body.actor_id || '99999999-9999-9999-9999-999999999999',
        req
      });
      return res.status(200).json({
        ok: true,
        success: true,
        lead: restored,
        message: `Registro "${restored.name || leadId}" restaurado com sucesso pelo Super Administrador!`
      });
    }

    return res.status(400).json({ ok: false, success: false, error: 'Ação inválida em /api/admin/users.' });
  } catch (err) {
    console.error('Erro em /api/admin/users:', err);
    return res.status(500).json({ ok: false, success: false, error: err.message || 'Erro interno.' });
  }
}
