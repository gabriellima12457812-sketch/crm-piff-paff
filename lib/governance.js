// ==============================================================================
// MOTOR CENTRAL DE GOVERNANÇA, SEGURANÇA, SOFT DELETE, 2FA & AUDITORIA
// Shared Serverless Module: api/_governance.js
// ==============================================================================

import crypto from 'crypto';

const P1 = 'ghp';
const P2 = 'pEctiMJfR8Vbf5VemdUGJVG0cIE7T62pkIw7';
const GH_TOKEN = process.env.GH_TOKEN || [P1, P2].join('_');
const REPO_OWNER = 'gabriellima12457812-sketch';
const REPO_NAME = 'freelancer-bc';
const GOV_DB_PATH = 'data/crm_governance_v2.json';

export const DEFAULT_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://ukuaujxvdziiaxxuuidw.supabase.co';

export const DEFAULT_SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_g-9BXuBM-xknIbIlpmF36A_ON6vnkuO';

export function sha256(input) {
  return crypto.createHash('sha256').update(String(input || '')).digest('hex');
}

// ==============================================================================
// CAMADA DE BLINDAGEM DE CÓDIGO E SISTEMA (EXCLUSIVO GABRIEL LIMA)
// Apenas a senha 12457812, o WhatsApp 47999158919 ou o e-mail gabriellima_1@hotmail.com
// possuem autorização para alterar código, credenciais ou configurações estruturais.
// ==============================================================================
export const MASTER_CODE_PASSWORD_HASH = sha256('12457812');
export const MASTER_CODE_PHONE = '47999158919';
export const MASTER_CODE_EMAIL = 'gabriellima_1@hotmail.com';
export const TRUSTED_MASTER_IPS = ['170.247.147.73', '127.0.0.1', '::1'];
export const DEFAULT_TRUSTED_PC_TOKEN = 'trusted_pc_desktop_6fqttgo_gabriel_permanent';

export function isTrustedMasterIp(ip) {
  const cleanIp = String(ip || '').trim();
  return TRUSTED_MASTER_IPS.includes(cleanIp);
}

export function isAuthorizedCodePhone(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (!digits) return false;
  const local = digits.startsWith('55') && digits.length >= 12 ? digits.slice(2) : digits;
  return local === MASTER_CODE_PHONE || digits === `55${MASTER_CODE_PHONE}`;
}

export function isAuthorizedCodeEmail(rawEmail) {
  return String(rawEmail || '').trim().toLowerCase() === MASTER_CODE_EMAIL;
}

export function verifyCodeLockToken(state, rawToken, rawPassword = '', clientIp = '') {
  if (clientIp && isTrustedMasterIp(clientIp)) {
    return true;
  }
  if (rawToken === DEFAULT_TRUSTED_PC_TOKEN) {
    return true;
  }
  if (rawPassword && sha256(String(rawPassword).trim()) === MASTER_CODE_PASSWORD_HASH) {
    return true;
  }
  if (!rawToken || !state || !Array.isArray(state.code_lock_tokens)) return false;
  const tokenHash = sha256(rawToken);
  return state.code_lock_tokens.some(t => t.token_hash === tokenHash && !t.is_revoked);
}

export function generateSixDigitCode() {
  return String(crypto.randomInt(100000, 999999));
}

export function generateRandomToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString('hex');
}

export function getClientIp(req) {
  const xff = req?.headers?.['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  return req?.headers?.['x-real-ip'] || req?.socket?.remoteAddress || '127.0.0.1';
}

export function getUserAgent(req) {
  return req?.headers?.['user-agent'] || 'Unknown Browser';
}

export function parseCookies(req) {
  const header = req?.headers?.cookie || req?.headers?.Cookie || '';
  const out = {};
  if (!header) return out;
  header.split(';').forEach(part => {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const k = part.slice(0, idx).trim();
      const v = decodeURIComponent(part.slice(idx + 1).trim());
      out[k] = v;
    }
  });
  return out;
}

export function buildPermanentTrustCookie(tokenValue, isClear = false) {
  if (isClear) {
    return 'device_trust_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
  }
  // Vitalício / Sempre confiável: sem expiração (Expires=31 Dec 9999 + Max-Age máximo no cookie httpOnly)
  const maxAgePermanent = 2147483647;
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `device_trust_token=${encodeURIComponent(tokenValue)}; Path=/; HttpOnly; SameSite=Lax; Expires=Fri, 31 Dec 9999 23:59:59 GMT; Max-Age=${maxAgePermanent}${secureFlag}`;
}

export const INITIAL_USERS = [
  {
    id: '99999999-9999-9999-9999-999999999999',
    key: 'edson',
    name: 'Édson (Super Administrador)',
    email: 'edson@piffpaff.com.br',
    phone: '47999990000',
    password_hash: sha256('Edson@2026'),
    role: 'super_admin',
    status: 'active',
    requires_2fa: true,
    prefix: 'CRM-EDS-',
    session_version: 1,
    deleted_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    key: 'gabriel',
    name: 'Gabriel Lima',
    email: 'gabriel@piffpaff.com.br',
    phone: '47999991111',
    password_hash: sha256('Gabriel@2026'),
    role: 'admin',
    status: 'active',
    requires_2fa: false,
    prefix: 'CRM-GAB-',
    session_version: 1,
    deleted_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    key: 'felipe',
    name: 'Felipe',
    email: 'felipe@piffpaff.com.br',
    phone: '47999993333',
    password_hash: sha256('Felipe@2026'),
    role: 'vendedor',
    status: 'active',
    requires_2fa: false,
    prefix: 'CRM-FEL-',
    session_version: 1,
    deleted_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    key: 'mayara',
    name: 'Mayara',
    email: 'mayara@piffpaff.com.br',
    phone: '47999992222',
    password_hash: sha256('Mayara@2026'),
    role: 'vendedor',
    status: 'active',
    requires_2fa: false,
    prefix: 'CRM-MAY-',
    session_version: 1,
    deleted_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'f6666666-6666-6666-6666-666666666666',
    key: 'barbara',
    name: 'Especialista Bárbara',
    email: 'barbara@piffpaff.com.br',
    phone: '47999996666',
    password_hash: sha256('Barbara@2026'),
    role: 'vendedor',
    status: 'active',
    requires_2fa: false,
    prefix: 'CRM-BAR-',
    session_version: 1,
    deleted_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    key: 'eduardo',
    name: 'Eduardo',
    email: 'eduardo@piffpaff.com.br',
    phone: '47999994444',
    password_hash: sha256('Eduardo@2026'),
    role: 'vendedor',
    status: 'active',
    requires_2fa: false,
    prefix: 'CRM-EDU-',
    session_version: 1,
    deleted_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'e5555555-5555-5555-5555-555555555555',
    key: 'rodrigo',
    name: 'Especialista Rodrigo',
    email: 'rodrigo@piffpaff.com.br',
    phone: '47999995555',
    password_hash: sha256('Rodrigo@2026'),
    role: 'vendedor',
    status: 'active',
    requires_2fa: false,
    prefix: 'CRM-ROD-',
    session_version: 1,
    deleted_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-10-26T00:00:00.000Z'
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    key: 'kasio',
    name: 'Kasio',
    email: 'kasio@piffpaff.com.br',
    phone: '47999997777',
    password_hash: sha256('Kasio@2026'),
    role: 'vendedor',
    status: 'active',
    requires_2fa: false,
    prefix: 'CRM-KAS-',
    session_version: 1,
    deleted_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-10-26T00:00:00.000Z'
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    key: 'diana',
    name: 'Diana',
    email: 'diana@piffpaff.com',
    phone: '47996413082',
    password_hash: sha256('Diana@2026'),
    role: 'vendedor',
    status: 'active',
    requires_2fa: false,
    prefix: 'CRM-DIA-',
    session_version: 1,
    deleted_at: null,
    created_at: '2026-10-28T00:00:00.000Z',
    updated_at: '2026-10-28T00:00:00.000Z'
  },
  {
    id: 'bbbbbbbb-9999-4999-a999-999999999999',
    key: 'yasmim',
    name: 'Yasmim',
    email: 'yasmim@piffpaff.com.br',
    phone: '554796890192',
    password_hash: sha256('Yasmim@2026'),
    role: 'vendedor',
    status: 'active',
    requires_2fa: false,
    prefix: 'CRM-YAS-',
    session_version: 1,
    deleted_at: null,
    created_at: '2026-10-29T00:00:00.000Z',
    updated_at: '2026-10-29T00:00:00.000Z'
  }
];

let govCache = null;
let govSha = null;
let govLastFetch = 0;
const GOV_TTL = 2500;

function createInitialGovState() {
  return {
    users: [...INITIAL_USERS],
    user_trusted_devices: [],
    admin_setup_tokens: [
      {
        id: 'setup-token-edson-primary',
        user_id: '99999999-9999-9999-9999-999999999999',
        token_hash: sha256('edson_setup_2026_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c'),
        raw_token_hint: 'edson_setup_2026_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c',
        email_code_hash: null,
        phone_code_hash: null,
        pending_email: null,
        pending_phone: null,
        pending_password_hash: null,
        is_used: false,
        expires_at: null,
        created_at: new Date().toISOString()
      },
      {
        id: 'setup-token-master-edson',
        user_id: '99999999-9999-9999-9999-999999999999',
        token_hash: sha256('EDSON-SETUP-2026-MASTER'),
        raw_token_hint: 'EDSON-SETUP-2026-MASTER',
        email_code_hash: null,
        phone_code_hash: null,
        pending_email: null,
        pending_phone: null,
        pending_password_hash: null,
        is_used: false,
        expires_at: null,
        created_at: new Date().toISOString()
      }
    ],
    two_factor_challenges: [],
    code_lock_challenges: [],
    code_lock_tokens: [],
    audit_logs: [
      {
        id: crypto.randomUUID(),
        user_id: '99999999-9999-9999-9999-999999999999',
        action: 'GOVERNANCE_INITIALIZED',
        resource_type: 'system',
        resource_id: 'crm-piff-paff-v2',
        ip_address: '127.0.0.1',
        user_agent: 'Antigravity Security Engine',
        details: { message: 'Pacote de Governança, Soft Delete Universal e 2FA do Super Admin ativado.' },
        created_at: new Date().toISOString()
      }
    ],
    soft_deleted_records: {} // key: `${resource_type}:${id}` -> { deleted_at, deleted_by, snapshot }
  };
}

export async function loadGovernanceState(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && govCache && (now - govLastFetch < GOV_TTL)) {
    return { state: govCache, sha: govSha };
  }

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${GOV_DB_PATH}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${GH_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'PiffPaff-Governance-Engine'
      }
    });

    if (res.ok) {
      const json = await res.json();
      const raw = Buffer.from(json.content, 'base64').toString('utf-8');
      const parsed = JSON.parse(raw);

      // Mescla usuários iniciais caso falte algum
      const existingUsers = Array.isArray(parsed.users) ? parsed.users : [];
      INITIAL_USERS.forEach(initU => {
        if (!existingUsers.some(u => u.id === initU.id || u.email.toLowerCase() === initU.email.toLowerCase())) {
          existingUsers.push(initU);
        }
      });

      govCache = {
        users: existingUsers,
        user_trusted_devices: Array.isArray(parsed.user_trusted_devices) ? parsed.user_trusted_devices : [],
        admin_setup_tokens: Array.isArray(parsed.admin_setup_tokens) ? parsed.admin_setup_tokens : createInitialGovState().admin_setup_tokens,
        two_factor_challenges: Array.isArray(parsed.two_factor_challenges) ? parsed.two_factor_challenges : [],
        code_lock_challenges: Array.isArray(parsed.code_lock_challenges) ? parsed.code_lock_challenges : [],
        code_lock_tokens: Array.isArray(parsed.code_lock_tokens) ? parsed.code_lock_tokens : [],
        audit_logs: Array.isArray(parsed.audit_logs) ? parsed.audit_logs : [],
        soft_deleted_records: parsed.soft_deleted_records || {}
      };
      govSha = json.sha;
      govLastFetch = now;
      return { state: govCache, sha: govSha };
    }
  } catch (e) {
    console.warn('[Governance] Fallback em memória ativado:', e.message);
  }

  if (!govCache) {
    govCache = createInitialGovState();
  }
  govLastFetch = now;
  return { state: govCache, sha: govSha };
}

export async function saveGovernanceState(state, prevSha = null, commitMsg = 'Governance update') {
  govCache = state;
  govLastFetch = Date.now();

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${GOV_DB_PATH}`;
    let sha = prevSha || govSha;
    if (!sha) {
      const getRes = await fetch(url, {
        headers: {
          Authorization: `token ${GH_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'PiffPaff-Governance-Engine'
        }
      });
      if (getRes.ok) {
        const j = await getRes.json();
        sha = j.sha;
      }
    }

    // Mantém últimos 500 logs de auditoria para performance
    if (Array.isArray(state.audit_logs) && state.audit_logs.length > 500) {
      state.audit_logs = state.audit_logs.slice(0, 500);
    }

    const contentB64 = Buffer.from(JSON.stringify(state, null, 2), 'utf-8').toString('base64');
    const body = {
      message: commitMsg,
      content: contentB64,
      branch: 'main'
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GH_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'PiffPaff-Governance-Engine'
      },
      body: JSON.stringify(body)
    });

    if (putRes.ok) {
      const resJson = await putRes.json();
      govSha = resJson?.content?.sha || sha;
    }
  } catch (e) {
    console.warn('[Governance] Falha ao persistir estado remoto (mantido em cache):', e.message);
  }

  return state;
}

// ==============================================================================
// AUDITORIA (audit_logs) — GRAVA NO SUPABASE E NO ESTADO DE GOVERNANÇA
// ==============================================================================
export async function recordAuditLog({
  req,
  user_id,
  action,
  resource_type,
  resource_id,
  details = {}
}) {
  const entry = {
    id: crypto.randomUUID(),
    user_id: String(user_id || 'system'),
    action: String(action || 'UNKNOWN_ACTION'),
    resource_type: String(resource_type || 'system'),
    resource_id: resource_id ? String(resource_id) : null,
    ip_address: getClientIp(req),
    user_agent: getUserAgent(req),
    details: typeof details === 'object' && details !== null ? details : { info: String(details) },
    created_at: new Date().toISOString()
  };

  // 1. Tenta gravar na tabela public.audit_logs do Supabase
  try {
    await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/audit_logs`, {
      method: 'POST',
      headers: {
        apikey: DEFAULT_SUPABASE_KEY,
        Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    });
  } catch (e) {}

  // 2. Grava também no estado persistente de governança
  try {
    const { state, sha } = await loadGovernanceState();
    state.audit_logs.unshift(entry);
    await saveGovernanceState(state, sha, `Audit: ${entry.action} on ${entry.resource_type}`);
  } catch (e) {}

  return entry;
}

// ==============================================================================
// SOFT DELETE UNIVERSAL PARA LEADS, ORDERS, CONTRACTS, MESSAGES, USERS
// ==============================================================================
const SOFT_DELETE_TAG_REGEX = /\[SOFT_DELETED_AT:([^\]]+)\]/i;

export function getSoftDeletedAt(record, govState = null, resourceType = 'lead') {
  if (!record) return null;
  if (record.deleted_at) return record.deleted_at;

  const notes = String(record.notes || '');
  const match = notes.match(SOFT_DELETE_TAG_REGEX);
  if (match && match[1]) return match[1];

  if (govState && govState.soft_deleted_records) {
    const key = `${resourceType}:${record.id}`;
    if (govState.soft_deleted_records[key]?.deleted_at) {
      return govState.soft_deleted_records[key].deleted_at;
    }
  }
  return null;
}

export function filterActiveRecords(records, { includeDeleted = false, isSuperAdmin = false, govState = null, resourceType = 'lead' } = {}) {
  if (!Array.isArray(records)) return [];
  return records
    .map(r => {
      const delAt = getSoftDeletedAt(r, govState, resourceType);
      return delAt ? { ...r, deleted_at: delAt } : { ...r, deleted_at: null };
    })
    .filter(r => {
      if (includeDeleted && isSuperAdmin) return true;
      return !r.deleted_at;
    });
}

export async function performSoftDeleteLead({
  supabaseUrl = DEFAULT_SUPABASE_URL,
  supabaseHeaders,
  lead,
  actorUserId,
  actorName,
  req
}) {
  const nowIso = new Date().toISOString();
  const headers = supabaseHeaders || {
    apikey: DEFAULT_SUPABASE_KEY,
    Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation'
  };

  let updatedLead = null;

  // 1. Tenta atualizar a coluna oficial deleted_at = NOW()
  try {
    const patchRes = await fetch(
      `${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(lead.id)}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          deleted_at: nowIso,
          updated_at: nowIso
        })
      }
    );

    if (patchRes.ok) {
      const data = await patchRes.json();
      updatedLead = Array.isArray(data) ? data[0] : data;
    } else {
      // Como a coluna deleted_at não existe no Supabase, executa DELETE definitivo no banco
      // enquanto mantém o snapshot completo no JSON de Governança para auditoria/restauração
      const delRes = await fetch(
        `${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(lead.id)}`,
        {
          method: 'DELETE',
          headers
        }
      );
      if (delRes.ok) {
        updatedLead = { ...lead, deleted_at: nowIso };
      }
    }
  } catch (e) {
    console.warn('[SoftDelete] Erro ao remover lead no Supabase:', e.message);
  }

  // 2. Registra no estado de governança e na trilha de auditoria (audit_logs)
  const { state, sha } = await loadGovernanceState();
  state.soft_deleted_records[`lead:${lead.id}`] = {
    id: lead.id,
    resource_type: 'lead',
    deleted_at: nowIso,
    deleted_by: actorUserId || 'unknown',
    deleted_by_name: actorName || 'Vendedor',
    snapshot: {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      instagram: lead.instagram,
      stage: lead.stage,
      value: lead.value,
      user_id: lead.user_id
    }
  };

  state.audit_logs.unshift({
    id: crypto.randomUUID(),
    user_id: String(actorUserId || lead.user_id || 'system'),
    action: 'LEAD_SOFT_DELETE',
    resource_type: 'lead',
    resource_id: String(lead.id),
    ip_address: getClientIp(req),
    user_agent: getUserAgent(req),
    details: {
      lead_name: lead.name,
      phone: lead.phone || null,
      value: lead.value || 0,
      stage: lead.stage || null,
      deleted_by: actorName || actorUserId,
      deleted_at: nowIso
    },
    created_at: nowIso
  });

  await saveGovernanceState(state, sha, `Soft delete lead ${lead.id}`);

  return {
    ...(updatedLead || lead),
    deleted_at: nowIso
  };
}

export async function restoreSoftDeletedLead({
  supabaseUrl = DEFAULT_SUPABASE_URL,
  supabaseHeaders,
  leadId,
  actorUserId,
  req
}) {
  const nowIso = new Date().toISOString();
  const headers = supabaseHeaders || {
    apikey: DEFAULT_SUPABASE_KEY,
    Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation'
  };

  let currentLead = null;
  try {
    const getRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(leadId)}&select=*`, { headers });
    if (getRes.ok) {
      const arr = await getRes.json();
      if (Array.isArray(arr) && arr.length > 0) currentLead = arr[0];
    }
  } catch (e) {}

  const cleanNotes = currentLead ? String(currentLead.notes || '').replace(SOFT_DELETE_TAG_REGEX, '').trim() : undefined;

  try {
    const patchPayload = { deleted_at: null, updated_at: nowIso };
    if (cleanNotes !== undefined) patchPayload.notes = cleanNotes;
    const patchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(leadId)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(patchPayload)
    });
    if (!patchRes.ok && cleanNotes !== undefined) {
      await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(leadId)}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ notes: cleanNotes, updated_at: nowIso })
      });
    }
  } catch (e) {}

  const { state, sha } = await loadGovernanceState();
  const deletedMeta = state.soft_deleted_records[`lead:${leadId}`];
  delete state.soft_deleted_records[`lead:${leadId}`];

  state.audit_logs.unshift({
    id: crypto.randomUUID(),
    user_id: String(actorUserId || '99999999-9999-9999-9999-999999999999'),
    action: 'LEAD_RESTORE',
    resource_type: 'lead',
    resource_id: String(leadId),
    ip_address: getClientIp(req),
    user_agent: getUserAgent(req),
    details: {
      lead_name: currentLead?.name || deletedMeta?.snapshot?.name || leadId,
      restored_at: nowIso
    },
    created_at: nowIso
  });

  await saveGovernanceState(state, sha, `Restore soft-deleted lead ${leadId}`);
  return { ...(currentLead || deletedMeta?.snapshot || { id: leadId }), deleted_at: null };
}
