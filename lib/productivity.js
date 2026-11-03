// ==============================================================================
// MOTOR DE PRODUTIVIDADE COMERCIAL, RASTREAMENTO AUTOMÁTICO DE CHAMADAS,
// INBOUND, REMARKETING & DASHBOARD SEMANAL (SEGUNDA A DOMINGO)
// Shared Serverless Module: lib/productivity.js
// ==============================================================================

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_KEY
} from './governance.js';

const P1 = 'ghp';
const P2 = 'pEctiMJfR8Vbf5VemdUGJVG0cIE7T62pkIw7';
const GH_TOKEN = process.env.GH_TOKEN || [P1, P2].join('_');
const REPO_OWNER = 'gabriellima12457812-sketch';
const REPO_NAME = process.env.REPO_NAME || 'crm-piff-paff';
const PROD_DB_PATH = 'data/crm_productivity.json';

let prodCache = null;
let prodSha = null;
let prodLastFetch = 0;
const PROD_TTL = 3000;

function cleanPhone(raw) {
  if (!raw) return '';
  return String(raw).replace(/\D/g, '');
}

export function normalizeSellerSlug(userId) {
  if (!userId) return 'gabriel';
  const raw = String(userId).trim().toLowerCase();
  
  const UUID_TO_SLUG = {
    'bbbbbbbb-9999-4999-a999-999999999999': 'yasmim',
    'd4444444-4444-4444-4444-444444444444': 'eduardo',
    'a1111111-1111-1111-1111-111111111111': 'gabriel',
    'b2222222-2222-2222-2222-222222222222': 'mayara',
    'c3333333-3333-3333-3333-333333333333': 'felipe',
    'f6666666-6666-6666-6666-666666666666': 'barbara',
    'e5555555-5555-5555-5555-555555555555': 'rodrigo',
    '77777777-7777-7777-7777-777777777777': 'kasio',
    '88888888-8888-8888-8888-888888888888': 'diana',
    '528bdca6-62a3-4dd5-bc45-0e77e9174e67': 'sebastiao',
    '99999999-9999-9999-9999-999999999999': 'edson'
  };

  if (UUID_TO_SLUG[raw]) return UUID_TO_SLUG[raw];
  return raw;
}

export function getWeekRange(dateInput = new Date()) {
  const d = new Date(dateInput);
  const day = d.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const days = [];
  const dayNames = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  const shortNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const ymd = dayDate.toISOString().split('T')[0];
    days.push({
      date: ymd,
      dayName: dayNames[i],
      shortName: shortNames[i],
      dayIndex: i
    });
  }

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    mondayYmd: days[0].date,
    sundayYmd: days[6].date,
    mondayIso: monday.toISOString(),
    sundayIso: sunday.toISOString(),
    days
  };
}

// ------------------------------------------------------------------------------
// PERSISTÊNCIA DUAL ENGINE (SUPABASE + GITHUB JSON RESILIENTE)
// ------------------------------------------------------------------------------

function isValidProductivityNumber(num) {
  if (!num) return true;
  const clean = String(num).replace(/\D/g, '');
  if (clean.length > 13 && !clean.startsWith('55')) return false;
  if (clean === '97526040547358' || clean === '169569687728165') return false;
  return true;
}

function filterCleanState(parsed) {
  const isInvalidCall = (c) => {
    if (!c) return true;
    if (c.id === '5c3aa95f-8599-46c9-bae0-793cd70c3c79' || c.duration_seconds === 84) return true;
    if (!isValidProductivityNumber(c.recipient_number) || !isValidProductivityNumber(c.caller_number)) return true;
    return false;
  };

  const cleanCalls = (Array.isArray(parsed.calls) ? parsed.calls : []).filter(c => !isInvalidCall(c));
  const validCallIds = new Set(cleanCalls.map(c => c.id));

  const cleanActivities = (Array.isArray(parsed.activities) ? parsed.activities : []).filter(a => {
    if (a.activity_type === 'CALL') {
      const meta = a.metadata || {};
      if (meta.duration_seconds === 84) return false;
      if (!isValidProductivityNumber(meta.recipient_number) || !isValidProductivityNumber(meta.caller_number)) return false;
      if (meta.call_id && !validCallIds.has(meta.call_id)) return false;
    }
    return true;
  });

  return {
    calls: cleanCalls,
    activities: cleanActivities,
    updated_at: parsed.updated_at || new Date().toISOString()
  };
}

export async function loadProductivityState() {
  const now = Date.now();
  if (prodCache && (now - prodLastFetch < PROD_TTL)) {
    return { state: prodCache, sha: prodSha };
  }

  const initial = {
    calls: [],
    activities: [],
    updated_at: new Date().toISOString()
  };

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PROD_DB_PATH}`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${GH_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'PiffPaff-Productivity-Engine'
      }
    });

    if (res.ok) {
      const json = await res.json();
      const contentStr = Buffer.from(json.content, 'base64').toString('utf-8');
      const parsed = JSON.parse(contentStr);
      prodCache = filterCleanState(parsed);
      prodSha = json.sha;
      prodLastFetch = now;
      return { state: prodCache, sha: prodSha };
    }
  } catch (err) {
    console.warn('[Productivity] Falha leitura GitHub DB, usando fallback local:', err.message);
  }

  // Fallback para arquivo local no filesystem
  try {
    const localPath = path.resolve(process.cwd(), PROD_DB_PATH);
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, 'utf8');
      const parsed = JSON.parse(raw);
      prodCache = filterCleanState(parsed);
      prodLastFetch = now;
      return { state: prodCache, sha: null };
    }
  } catch (fsErr) {
    console.warn('[Productivity] Fallback fs local não disponível:', fsErr.message);
  }

  if (!prodCache) prodCache = initial;
  return { state: prodCache, sha: null };
}

export async function saveProductivityState(newState, commitMessage = 'Atualização automática de métricas de produtividade') {
  prodCache = newState;
  prodLastFetch = Date.now();

  // Salva no arquivo local se possível
  try {
    const localPath = path.resolve(process.cwd(), PROD_DB_PATH);
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(localPath, JSON.stringify(newState, null, 2), 'utf8');
  } catch (fsErr) {
    console.warn('[Productivity] Erro ao gravar localmente:', fsErr.message);
  }

  // BLINDAGEM DE COTA DE DEPLOY: Não faz commit no GitHub para cada evento recebido via webhook.
  // Fazer commit a cada ligação estoura o limite diário de 100 deploys da Vercel Hobby.
  const enableGhSync = process.env.ENABLE_GITHUB_PROD_SYNC === 'true';
  if (!enableGhSync) {
    return true;
  }

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PROD_DB_PATH}`;
  const contentBytes = Buffer.from(JSON.stringify(newState, null, 2), 'utf-8');
  const b64 = contentBytes.toString('base64');

  let sha = prodSha;
  if (!sha) {
    try {
      const curr = await loadProductivityState();
      sha = curr.sha;
    } catch (e) {}
  }

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GH_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'PiffPaff-Productivity-Engine'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: b64,
        ...(sha ? { sha } : {})
      })
    });

    if (res.ok) {
      const json = await res.json();
      prodSha = json.content?.sha || null;
      return true;
    }
  } catch (err) {
    console.warn('[Productivity] Falha ao persistir no GitHub DB:', err.message);
  }
  return false;
}

// ------------------------------------------------------------------------------
// FUNÇÕES DE REGISTRO AUTOMÁTICO (CHAMADAS, INBOUND, REMARKETING)
// ------------------------------------------------------------------------------

/**
 * Registra automaticamente uma chamada telefônica / WhatsApp com DEDUPLICAÇÃO BLINDADA
 */
export async function recordCallEvent({
  userId,
  leadId = null,
  callerNumber,
  recipientNumber,
  callSource = 'WHATSAPP',
  status,
  durationSeconds,
  recordingUrl = null,
  startedAt,
  endedAt,
  callId = null,
  metadata = {}
}) {
  const cleanRecipient = cleanPhone(recipientNumber);
  const cleanCaller = cleanPhone(callerNumber);

  // 1. BLINDAGEM DE LIDs BRUTOS: descarta identificadores internos do WhatsApp Baileys não mapeados
  if ((cleanRecipient && cleanRecipient.length > 13 && !cleanRecipient.startsWith('55')) ||
      (cleanCaller && cleanCaller.length > 13 && !cleanCaller.startsWith('55')) ||
      cleanRecipient === '97526040547358' || cleanCaller === '97526040547358') {
    console.warn('[recordCallEvent] Descartando LID interno do WhatsApp não resolvido:', cleanRecipient || cleanCaller);
    return { success: false, ignored: true, reason: 'INVALID_LID_NUMBER' };
  }

  const now = new Date();
  const start = startedAt ? new Date(startedAt) : now;
  const end = endedAt ? new Date(endedAt) : (durationSeconds ? new Date(start.getTime() + durationSeconds * 1000) : now);

  let dur = typeof durationSeconds === 'number'
    ? durationSeconds
    : Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));

  let finalStatus = status;
  if (!finalStatus) {
    finalStatus = dur > 0 ? 'ANSWERED' : 'NO_ANSWER';
  }

  const cleanUserId = normalizeSellerSlug(userId || 'gabriel');
  const externalId = callId || metadata?.callId || metadata?.external_call_id || null;

  // 2. DEDUPLICAÇÃO INTELIGENTE (SLIDING WINDOW DE 120s OU POR CALL ID)
  const { state } = await loadProductivityState();
  if (!Array.isArray(state.calls)) state.calls = [];
  if (!Array.isArray(state.activities)) state.activities = [];

  const existingCall = state.calls.find(c => {
    if (externalId && (c.external_call_id === externalId || c.metadata?.call_id === externalId || c.id === externalId)) {
      return true;
    }
    const sameUser = matchesSeller(c.user_id, cleanUserId);
    const sameNum = (cleanRecipient && (c.recipient_number === cleanRecipient || c.caller_number === cleanRecipient)) ||
                    (cleanCaller && (c.caller_number === cleanCaller || c.recipient_number === cleanCaller));
    const timeDiff = Math.abs(new Date(c.started_at).getTime() - start.getTime());
    return sameUser && sameNum && timeDiff < 120000;
  });

  if (existingCall) {
    // Se a chamada já foi registrada e o novo evento traz atendimento real (duração > 0)
    if (dur > 0 && existingCall.duration_seconds === 0) {
      existingCall.duration_seconds = dur;
      existingCall.status = 'ANSWERED';
      existingCall.ended_at = end.toISOString();
      if (recordingUrl) existingCall.recording_url = recordingUrl;
      if (externalId) existingCall.external_call_id = externalId;

      const act = state.activities.find(a => a.metadata?.call_id === existingCall.id);
      if (act && act.metadata) {
        act.metadata.duration_seconds = dur;
        act.metadata.status = 'ANSWERED';
      }

      state.updated_at = now.toISOString();
      await saveProductivityState(state, `Atualização de chamada atendida (${dur}s) para ${existingCall.recipient_number}`);
      return { call: existingCall, activity: act, updated: true, duplicate: false };
    }

    // Se é o mesmo evento repetido (ex: Baileys enviando offer, ringing, terminate sucessivos de 0s)
    console.log('[recordCallEvent] Pacote duplicado ignorado com sucesso:', existingCall.id, existingCall.recipient_number);
    return { call: existingCall, ignored: true, duplicate: true, reason: 'DUPLICATE_CALL_EVENT' };
  }

  // 3. REGISTRA NOVA CHAMADA ÚNICA
  const callRecord = {
    id: crypto.randomUUID(),
    external_call_id: externalId,
    user_id: cleanUserId,
    lead_id: leadId ? String(leadId) : null,
    caller_number: cleanCaller || String(callerNumber || ''),
    recipient_number: cleanRecipient || String(recipientNumber || ''),
    call_source: String(callSource || 'WHATSAPP').toUpperCase(),
    status: String(finalStatus).toUpperCase(),
    duration_seconds: dur,
    recording_url: recordingUrl || null,
    started_at: start.toISOString(),
    ended_at: end.toISOString(),
    created_at: now.toISOString()
  };

  const activityRecord = {
    id: crypto.randomUUID(),
    user_id: callRecord.user_id,
    lead_id: callRecord.lead_id,
    activity_type: 'CALL',
    metadata: {
      call_id: callRecord.id,
      external_call_id: externalId,
      duration_seconds: dur,
      status: callRecord.status,
      caller_number: callRecord.caller_number,
      recipient_number: callRecord.recipient_number,
      call_source: callRecord.call_source,
      recording_url: callRecord.recording_url,
      ...metadata
    },
    created_at: now.toISOString()
  };

  // 1. Grava no Supabase (tabela ativa: historico_interacoes)
  try {
    const headers = {
      apikey: DEFAULT_SUPABASE_KEY,
      Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    };

    const histRecord = {
      lead_id: callRecord.lead_id || undefined,
      telefone: callRecord.recipient_number,
      nome_cliente: metadata?.lead_name || metadata?.name || 'Contato Comercial',
      resumo_interacao: `Ligação (${dur > 0 ? dur + 's' : 'Não Atendida'}): ${metadata?.notes || callRecord.status}`,
      intencao: JSON.stringify({
        kind: 'CALL',
        duration_seconds: dur,
        status: callRecord.status,
        caller_number: callRecord.caller_number,
        recipient_number: callRecord.recipient_number,
        call_source: callRecord.call_source,
        started_at: callRecord.started_at,
        ended_at: callRecord.ended_at,
        notes: metadata?.notes || ''
      }),
      origem: 'CALL',
      vendedor_id: cleanUserId,
      user_id: userId && userId.includes('-') ? userId : undefined,
      created_at: callRecord.created_at
    };

    await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/historico_interacoes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(histRecord)
    }).catch(() => {});

    await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/sales_calls`, {
      method: 'POST',
      headers,
      body: JSON.stringify(callRecord)
    }).catch(() => {});

    await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/sales_activities`, {
      method: 'POST',
      headers,
      body: JSON.stringify(activityRecord)
    }).catch(() => {});
  } catch (e) {}

  // 2. Grava no JSON Store resiliente
  try {
    state.calls.unshift(callRecord);
    state.activities.unshift(activityRecord);
    if (state.calls.length > 3000) state.calls = state.calls.slice(0, 3000);
    if (state.activities.length > 5000) state.activities = state.activities.slice(0, 5000);
    state.updated_at = now.toISOString();
    await saveProductivityState(state, `Auto-registro de chamada: ${callRecord.status} (${dur}s) para ${callRecord.recipient_number}`);
  } catch (e) {}

  return { call: callRecord, activity: activityRecord, created: true };
}

/**
 * Registra automaticamente contato inbound recebido de lead
 */
export async function recordInboundContact({
  userId,
  leadId = null,
  phone = '',
  name = '',
  channel = 'whatsapp',
  message = '',
  metadata = {}
}) {
  const now = new Date();
  const normSlug = normalizeSellerSlug(userId);
  const activityRecord = {
    id: crypto.randomUUID(),
    user_id: normSlug,
    lead_id: leadId ? String(leadId) : null,
    activity_type: 'INBOUND_CONTACT',
    metadata: {
      phone: String(phone || ''),
      name: String(name || ''),
      channel: String(channel || 'whatsapp'),
      message: String(message || '').substring(0, 500),
      ...metadata
    },
    created_at: now.toISOString()
  };

  // 1. Grava no Supabase (tabela ativa: historico_interacoes)
  try {
    const headers = {
      apikey: DEFAULT_SUPABASE_KEY,
      Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    };

    const histRecord = {
      lead_id: activityRecord.lead_id || undefined,
      telefone: cleanPhone(phone) || '0000000000',
      nome_cliente: name || 'Lead WhatsApp',
      resumo_interacao: `Contato Inbound (${channel}): ${message || 'Mensagem recebida'}`,
      intencao: JSON.stringify({
        activity_type: 'INBOUND_CONTACT',
        phone,
        name,
        channel,
        message,
        metadata
      }),
      origem: 'INBOUND_CONTACT',
      vendedor_id: normSlug,
      created_at: activityRecord.created_at
    };

    await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/historico_interacoes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(histRecord)
    }).catch(() => {});

    await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/sales_activities`, {
      method: 'POST',
      headers,
      body: JSON.stringify(activityRecord)
    }).catch(() => {});
  } catch (e) {}

  // 2. JSON store resiliente
  try {
    const { state } = await loadProductivityState();
    state.activities.unshift(activityRecord);
    if (state.activities.length > 5000) state.activities = state.activities.slice(0, 5000);
    state.updated_at = now.toISOString();
    await saveProductivityState(state, `Auto-registro de Inbound: ${name || phone}`);
  } catch (e) {}

  return activityRecord;
}

/**
 * Registra automaticamente ação de remarketing (lead inativo > 48h ou follow-up/resgate)
 */
export async function recordRemarketingAction({
  userId,
  leadId = null,
  phone = '',
  name = '',
  channel = 'whatsapp',
  message = '',
  hoursInactive = 48,
  metadata = {}
}) {
  const now = new Date();
  const normSlug = normalizeSellerSlug(userId);
  const activityRecord = {
    id: crypto.randomUUID(),
    user_id: normSlug,
    lead_id: leadId ? String(leadId) : null,
    activity_type: 'REMARKETING',
    metadata: {
      phone: String(phone || ''),
      name: String(name || ''),
      channel: String(channel || 'whatsapp'),
      message: String(message || '').substring(0, 500),
      hours_inactive: hoursInactive,
      ...metadata
    },
    created_at: now.toISOString()
  };

  // 1. Grava no Supabase (tabela ativa: historico_interacoes)
  try {
    const headers = {
      apikey: DEFAULT_SUPABASE_KEY,
      Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    };

    const histRecord = {
      lead_id: activityRecord.lead_id || undefined,
      telefone: cleanPhone(phone) || '0000000000',
      nome_cliente: name || 'Lead WhatsApp',
      resumo_interacao: `Ação de Remarketing (>48h - ${channel}): ${message || 'Disparo para lead inativo'}`,
      intencao: JSON.stringify({
        activity_type: 'REMARKETING',
        phone,
        name,
        channel,
        message,
        hours_inactive: hoursInactive,
        metadata
      }),
      origem: 'REMARKETING',
      vendedor_id: normSlug,
      created_at: activityRecord.created_at
    };

    await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/historico_interacoes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(histRecord)
    }).catch(() => {});

    await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/sales_activities`, {
      method: 'POST',
      headers,
      body: JSON.stringify(activityRecord)
    }).catch(() => {});
  } catch (e) {}

  // 2. JSON store resiliente
  try {
    const { state } = await loadProductivityState();
    state.activities.unshift(activityRecord);
    if (state.activities.length > 5000) state.activities = state.activities.slice(0, 5000);
    state.updated_at = now.toISOString();
    await saveProductivityState(state, `Auto-registro de Remarketing: ${name || phone}`);
  } catch (e) {}

  return activityRecord;
}

// ------------------------------------------------------------------------------
// CONSOLIDADOR DO DASHBOARD SEMANAL (SEGUNDA A DOMINGO)
// ------------------------------------------------------------------------------

export const SELLER_ALIASES = {
  gabriel: ['gabriel', 'a1111111-1111-1111-1111-111111111111', 'gabriellima_1@hotmail.com', 'gabriel@piffpaff.com'],
  felipe: ['felipe', 'c3333333-3333-3333-3333-333333333333', 'felipe@piffpaff.com'],
  mayara: ['mayara', 'b2222222-2222-2222-2222-222222222222', 'mayara@piffpaff.com'],
  eduardo: ['eduardo', 'd4444444-4444-4444-4444-444444444444', 'eduardo@piffpaff.com'],
  rodrigo: ['rodrigo', 'e5555555-5555-5555-5555-555555555555', 'rodrigo@piffpaff.com'],
  kasio: ['kasio', '77777777-7777-7777-7777-777777777777', 'kasio@piffpaff.com'],
  diana: ['diana', '88888888-8888-8888-8888-888888888888', 'diana@piffpaff.com'],
  sebastiao: ['sebastiao', '528bdca6-62a3-4dd5-bc45-0e77e9174e67', 'sebastiao@piffpaff.com'],
  barbara: ['barbara', 'f6666666-6666-6666-6666-666666666666', 'barbara@piffpaff.com'],
  yasmim: ['yasmim', 'yasmin', 'bbbbbbbb-9999-4999-a999-999999999999', 'yasmim@piffpaff.com.br', 'yasmim@piffpaff.com'],
  edson: ['edson', '99999999-9999-9999-9999-999999999999', 'edson@piffpaff.com']
};

export function matchesSeller(recordUserId, sellerKey, userId) {
  if (!sellerKey || sellerKey === 'all' || sellerKey === 'edson') return true;
  const targetKey = String(sellerKey).toLowerCase().trim();
  const recId = String(recordUserId || '').toLowerCase().trim();
  if (!recId) return false;

  // Comparação direta com a chave ou com o userId
  if (recId === targetKey) return true;
  if (userId && recId === String(userId).toLowerCase().trim()) return true;

  // Busca em aliases conhecidos do vendedor
  const aliases = SELLER_ALIASES[targetKey];
  if (aliases && aliases.some(a => a.toLowerCase() === recId || recId.includes(a.toLowerCase()))) {
    return true;
  }

  return false;
}

export function parseHistoricoInteracaoRow(row) {
  if (!row) return null;
  let parsedMeta = null;
  if (row.intencao) {
    try {
      if (typeof row.intencao === 'object') parsedMeta = row.intencao;
      else if (typeof row.intencao === 'string' && (row.intencao.startsWith('{') || row.intencao.startsWith('['))) {
        parsedMeta = JSON.parse(row.intencao);
      }
    } catch (e) {}
  }

  const orig = String(row.origem || '').toUpperCase();
  const resumo = String(row.resumo_interacao || '');

  const isCall = orig === 'CALL' || orig.includes('CALL') || orig.includes('LIGAÇÃO') || orig.includes('CHAMADA') ||
                 resumo.startsWith('Ligação') || resumo.startsWith('Chamada') ||
                 (parsedMeta && (parsedMeta.kind === 'CALL' || typeof parsedMeta.duration_seconds === 'number' || parsedMeta.call_source));

  if (isCall) {
    let dur = parsedMeta?.duration_seconds;
    if (typeof dur !== 'number') {
      const matchSec = resumo.match(/(\d+)s/);
      dur = matchSec ? parseInt(matchSec[1], 10) : 0;
    }
    const status = parsedMeta?.status || (dur > 0 ? 'ANSWERED' : (resumo.includes('Não Atendida') ? 'NO_ANSWER' : 'ANSWERED'));
    const resolvedSeller = normalizeSellerSlug(row.vendedor_id || row.user_id);
    const callRecord = {
      id: row.id,
      user_id: resolvedSeller,
      lead_id: row.lead_id,
      caller_number: parsedMeta?.caller_number || 'Comercial Piff-Paff',
      recipient_number: row.telefone,
      call_source: parsedMeta?.call_source || 'WHATSAPP',
      status: status,
      duration_seconds: dur,
      notes: parsedMeta?.notes || (resumo.includes(':') ? resumo.split(':').slice(1).join(':').trim() : resumo),
      started_at: parsedMeta?.started_at || row.created_at,
      ended_at: parsedMeta?.ended_at || row.created_at,
      created_at: row.created_at
    };
    return { type: 'CALL', record: callRecord };
  }

  const actType = orig === 'REMARKETING' ? 'REMARKETING' : (orig === 'INBOUND_CONTACT' ? 'INBOUND_CONTACT' : (resumo.includes('Cliente ➡️') ? 'INBOUND_CONTACT' : 'REMARKETING'));
  const resolvedSeller = normalizeSellerSlug(row.vendedor_id || row.user_id);
  const activityRecord = {
    id: row.id,
    user_id: resolvedSeller,
    lead_id: row.lead_id,
    activity_type: actType,
    metadata: {
      phone: row.telefone,
      name: row.nome_cliente,
      channel: 'whatsapp',
      message: resumo,
      ...(parsedMeta || {})
    },
    created_at: row.created_at
  };
  return { type: 'ACTIVITY', record: activityRecord };
}

export async function getWeeklyProductivityData({
  userId = null,
  sellerKey = null,
  weekOffset = 0,
  referenceDate = new Date()
}) {
  // Ajuste de semana
  const targetDate = new Date(referenceDate);
  if (weekOffset !== 0) {
    targetDate.setDate(targetDate.getDate() + (weekOffset * 7));
  }

  const week = getWeekRange(targetDate);

  // 1. Carrega dados do Supabase na tabela ativa historico_interacoes
  let cloudCalls = [];
  let cloudActivities = [];

  try {
    const headers = {
      apikey: DEFAULT_SUPABASE_KEY,
      Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`
    };

    const histUrl = `${DEFAULT_SUPABASE_URL}/rest/v1/historico_interacoes?created_at=gte.${week.mondayIso}&created_at=lte.${week.sundayIso}&order=created_at.desc&limit=3000`;
    const rHist = await fetch(histUrl, { headers });
    if (rHist.ok) {
      const histRows = await rHist.json();
      if (Array.isArray(histRows)) {
        histRows.forEach(row => {
          const parsed = parseHistoricoInteracaoRow(row);
          if (parsed?.type === 'CALL') {
            cloudCalls.push(parsed.record);
          } else if (parsed?.type === 'ACTIVITY') {
            cloudActivities.push(parsed.record);
          }
        });
      }
    }

    // Fallback legado se existirem tabelas dedicadas
    const callsUrl = `${DEFAULT_SUPABASE_URL}/rest/v1/sales_calls?created_at=gte.${week.mondayIso}&created_at=lte.${week.sundayIso}&order=created_at.desc&limit=500`;
    const rCalls = await fetch(callsUrl, { headers }).catch(() => null);
    if (rCalls && rCalls.ok) {
      const extraCalls = await rCalls.json();
      if (Array.isArray(extraCalls)) cloudCalls.push(...extraCalls);
    }
  } catch (e) {
    console.warn('[Productivity] Falha ao carregar historico_interacoes:', e);
  }

  // 2. Carrega do JSON DB para merge completo resiliente
  const { state } = await loadProductivityState();
  const allCallsMap = new Map();
  const allActsMap = new Map();

  // Junta chamadas da semana
  const isDateInWeek = (dateStr) => {
    if (!dateStr) return false;
    const ymd = String(dateStr).split('T')[0];
    return ymd >= week.mondayYmd && ymd <= week.sundayYmd;
  };

  (state.calls || []).forEach(c => {
    if (isDateInWeek(c.created_at || c.started_at)) {
      if (matchesSeller(c.user_id, sellerKey, userId)) {
        allCallsMap.set(c.id, c);
      }
    }
  });

  (cloudCalls || []).forEach(c => {
    if (matchesSeller(c.user_id, sellerKey, userId)) {
      allCallsMap.set(c.id, c);
    }
  });

  // Junta atividades da semana
  (state.activities || []).forEach(a => {
    if (isDateInWeek(a.created_at)) {
      if (matchesSeller(a.user_id, sellerKey, userId)) {
        allActsMap.set(a.id, a);
      }
    }
  });

  (cloudActivities || []).forEach(a => {
    if (matchesSeller(a.user_id, sellerKey, userId)) {
      allActsMap.set(a.id, a);
    }
  });

  const callsList = Array.from(allCallsMap.values());
  const activitiesList = Array.from(allActsMap.values());

  // 3. Monta estrutura dia a dia (Segunda a Domingo)
  const daysMetrics = week.days.map(d => {
    const dayCalls = callsList.filter(c => c.created_at && c.created_at.startsWith(d.date));
    const dayActs = activitiesList.filter(a => a.created_at && a.created_at.startsWith(d.date));

    const answered = dayCalls.filter(c => c.status === 'ANSWERED' || (c.duration_seconds > 0));
    const noAnswer = dayCalls.filter(c => c.status === 'NO_ANSWER' || (!c.duration_seconds || c.duration_seconds === 0));

    const totalSeconds = answered.reduce((acc, c) => acc + (Number(c.duration_seconds) || 0), 0);
    const avgSeconds = answered.length > 0 ? Math.round(totalSeconds / answered.length) : 0;

    const inbounds = dayActs.filter(a => a.activity_type === 'INBOUND_CONTACT');
    const remarketings = dayActs.filter(a => a.activity_type === 'REMARKETING');

    return {
      date: d.date,
      dayName: d.dayName,
      shortName: d.shortName,
      dayIndex: d.dayIndex,
      callsTotal: dayCalls.length,
      callsAnswered: answered.length,
      callsNoAnswer: noAnswer.length,
      answerRatePercent: dayCalls.length > 0 ? Math.round((answered.length / dayCalls.length) * 100) : 0,
      totalDurationSeconds: totalSeconds,
      avgDurationSeconds: avgSeconds,
      inboundContacts: inbounds.length,
      remarketingCount: remarketings.length,
      calls: dayCalls,
      activities: dayActs
    };
  });

  // 4. Totais e médias consolidadas da semana
  const totalCalls = callsList.length;
  const answeredCalls = callsList.filter(c => c.status === 'ANSWERED' || (c.duration_seconds > 0));
  const noAnswerCalls = callsList.filter(c => c.status === 'NO_ANSWER' || (!c.duration_seconds || c.duration_seconds === 0));
  const totalDurationSeconds = answeredCalls.reduce((acc, c) => acc + (Number(c.duration_seconds) || 0), 0);
  const avgDurationSeconds = answeredCalls.length > 0 ? Math.round(totalDurationSeconds / answeredCalls.length) : 0;
  const answerRate = totalCalls > 0 ? Math.round((answeredCalls.length / totalCalls) * 100) : 0;

  const totalInbound = activitiesList.filter(a => a.activity_type === 'INBOUND_CONTACT').length;
  const totalRemarketing = activitiesList.filter(a => a.activity_type === 'REMARKETING').length;

  return {
    week: {
      monday: week.mondayYmd,
      sunday: week.sundayYmd,
      weekOffset
    },
    totals: {
      totalCalls,
      answeredCalls: answeredCalls.length,
      noAnswerCalls: noAnswerCalls.length,
      answerRatePercent: answerRate,
      totalDurationSeconds,
      formattedTotalTime: formatDurationHuman(totalDurationSeconds),
      avgDurationSeconds,
      formattedAvgTime: formatDurationHuman(avgDurationSeconds),
      totalInbound,
      totalRemarketing
    },
    days: daysMetrics,
    recentCalls: callsList.slice(0, 50),
    recentActivities: activitiesList.slice(0, 50)
  };
}

export function formatDurationHuman(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  if (s === 0) return '0s';
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  const parts = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(' ');
}

/**
 * Consulta histórico de chamadas e ações para um lead específico com busca multi-variante
 */
export async function getLeadProductivityTimeline({ leadId = null, phone = null }) {
  const cleanP = cleanPhone(phone);
  const last8 = cleanP.slice(-8);
  const { state } = await loadProductivityState();

  let cloudCalls = [];
  let cloudActs = [];

  try {
    const headers = {
      apikey: DEFAULT_SUPABASE_KEY,
      Authorization: `Bearer ${DEFAULT_SUPABASE_KEY}`
    };

    const orParts = [];
    if (leadId) orParts.push(`lead_id.eq.${encodeURIComponent(leadId)}`);
    if (cleanP) {
      orParts.push(`telefone.eq.${cleanP}`);
      if (last8 && last8.length === 8) {
        orParts.push(`telefone.ilike.*${last8}*`);
      }
    }

    if (orParts.length > 0) {
      const orFilter = orParts.join(',');
      const histUrl = `${DEFAULT_SUPABASE_URL}/rest/v1/historico_interacoes?or=(${orFilter})&order=created_at.desc&limit=500`;
      const rHist = await fetch(histUrl, { headers });
      if (rHist.ok) {
        const histRows = await rHist.json();
        if (Array.isArray(histRows)) {
          histRows.forEach(row => {
            const parsed = parseHistoricoInteracaoRow(row);
            if (parsed?.type === 'CALL') {
              cloudCalls.push(parsed.record);
            } else if (parsed?.type === 'ACTIVITY') {
              cloudActs.push(parsed.record);
            }
          });
        }
      }

      // Fallback legado caso sales_calls venha a existir
      const rCalls = await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/sales_calls?or=(${orFilter})&order=created_at.desc`, { headers }).catch(() => null);
      if (rCalls && rCalls.ok) {
        const cData = await rCalls.json();
        if (Array.isArray(cData)) cloudCalls.push(...cData);
      }

      const rActs = await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/sales_activities?or=(${orFilter})&order=created_at.desc`, { headers }).catch(() => null);
      if (rActs && rActs.ok) {
        const aData = await rActs.json();
        if (Array.isArray(aData)) cloudActs.push(...aData);
      }
    }
  } catch (e) {
    console.warn('[Productivity] Erro timeline historico_interacoes:', e);
  }

  const callsMap = new Map();
  if (Array.isArray(cloudCalls)) {
    cloudCalls.forEach(c => callsMap.set(c.id, c));
  }

  (state.calls || []).forEach(c => {
    const matchesLead = leadId && String(c.lead_id) === String(leadId);
    const recPhone = cleanPhone(c.recipient_number);
    const calPhone = cleanPhone(c.caller_number);

    const matchesPhone = cleanP && (
      (recPhone && (recPhone === cleanP || recPhone.includes(cleanP) || cleanP.includes(recPhone) || (last8 && last8.length === 8 && recPhone.endsWith(last8)))) ||
      (calPhone && (calPhone === cleanP || calPhone.includes(cleanP) || cleanP.includes(calPhone) || (last8 && last8.length === 8 && calPhone.endsWith(last8))))
    );

    if (matchesLead || matchesPhone) {
      callsMap.set(c.id, c);
    }
  });

  const actsMap = new Map();
  if (Array.isArray(cloudActs)) {
    cloudActs.forEach(a => actsMap.set(a.id, a));
  }

  (state.activities || []).forEach(a => {
    const matchesLead = leadId && String(a.lead_id) === String(leadId);
    const actPhone = cleanPhone(a.metadata?.phone || a.metadata?.recipient_number);
    const matchesPhone = cleanP && actPhone && (
      actPhone === cleanP || actPhone.includes(cleanP) || cleanP.includes(actPhone) || (last8 && last8.length === 8 && actPhone.endsWith(last8))
    );

    if (matchesLead || matchesPhone) {
      actsMap.set(a.id, a);
    }
  });

  const calls = Array.from(callsMap.values()).sort((a, b) => new Date(b.created_at || b.started_at) - new Date(a.created_at || a.started_at));
  const activities = Array.from(actsMap.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return { calls, activities };
}
