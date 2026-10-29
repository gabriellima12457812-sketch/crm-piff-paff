// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/edson (ES Module)
// ENDPOINT DO SUPER ADMINISTRADOR • ÉDSON (DONO DA EMPRESA)
// VISÃO CONSOLIDADA TOTAL + GOVERNANÇA, AUDITORIA E RESTAURAÇÃO DE SOFT DELETE
// ==============================================================================

import {
  loadGovernanceState,
  filterActiveRecords,
  restoreSoftDeletedLead,
  performSoftDeleteLead,
  recordAuditLog,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_KEY
} from '../lib/governance.js';
import {
  getWeeklyProductivityData,
  getLeadProductivityTimeline,
  recordCallEvent,
  recordInboundContact,
  recordRemarketingAction
} from '../lib/productivity.js';
import authHandler from '../lib/auth.js';
import setupAdminHandler from '../lib/setup-admin.js';
import adminUsersHandler from '../lib/admin-users.js';

const OWNER_ID = '99999999-9999-9999-9999-999999999999';
const OWNER_NAME = 'Édson (Super Administrador)';

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  return { url, key };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const govRoute = String(req.query?.gov_route || '').toLowerCase();
  const reqUrl = String(req.url || '');
  if (govRoute === 'auth' || reqUrl.startsWith('/api/auth')) {
    return authHandler(req, res);
  }
  if (govRoute === 'setup_admin' || reqUrl.startsWith('/api/setup-admin')) {
    return setupAdminHandler(req, res);
  }
  if (govRoute === 'admin_users' || reqUrl.startsWith('/api/admin/users')) {
    return adminUsersHandler(req, res);
  }

  // ==============================================================================
  // MÓDULO DE PRODUTIVIDADE & RASTREAMENTO AUTOMÁTICO DE CHAMADAS / AÇÕES
  // ==============================================================================
  if (govRoute === 'productivity' || reqUrl.startsWith('/api/productivity')) {
    try {
      const leadId = req.query?.lead_id || null;
      const phone = req.query?.phone || null;
      if (leadId || phone) {
        const leadTimeline = await getLeadProductivityTimeline({ leadId, phone });
        return res.status(200).json({ success: true, ...leadTimeline });
      }

      const weekOffset = parseInt(req.query?.weekOffset || '0', 10) || 0;
      const callerSeller = String(req.headers['x-caller-seller'] || req.query?.caller_seller || '').toLowerCase().trim();
      let sellerKey = req.query?.seller || null;

      // Trava de Privacidade: Somente Gabriel Lima e Édson podem ver métricas de todos
      const isPrivilegedAdmin = (callerSeller === 'gabriel' || callerSeller === 'edson');
      if (callerSeller && !isPrivilegedAdmin) {
        // Vendedor comum: forçado a visualizar exclusivamente o seu próprio desempenho comercial
        sellerKey = callerSeller;
      }

      let targetUserId = null;
      if (sellerKey && sellerKey !== 'all' && sellerKey !== 'edson') {
        const { state: govState } = await loadGovernanceState();
        const matchingUser = (govState?.users || []).find(u => u.key === sellerKey || u.id === sellerKey);
        if (matchingUser) targetUserId = matchingUser.id;
      }
      const data = await getWeeklyProductivityData({ userId: targetUserId, sellerKey, weekOffset });
      return res.status(200).json({ success: true, ...data });
    } catch (err) {
      console.error('[Productivity API Error]:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (govRoute === 'productivity_call') {
    try {
      const body = req.body || {};
      const result = await recordCallEvent(body);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      console.error('[RecordCall Error]:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (govRoute === 'productivity_activity') {
    try {
      const body = req.body || {};
      let result;
      if (body.activity_type === 'INBOUND_CONTACT') {
        result = await recordInboundContact(body);
      } else if (body.activity_type === 'REMARKETING') {
        result = await recordRemarketingAction(body);
      } else {
        result = await recordInboundContact(body);
      }
      return res.status(200).json({ success: true, activity: result });
    } catch (err) {
      console.error('[RecordActivity Error]:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  try {
    const { url, key } = getSupabaseConfig();
    const headers = {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    };

    const { state: govState } = await loadGovernanceState();

    // =========================================================================
    // WEBHOOK UNIVERSAL WHATSAPP EVOLUTION API (/api/n8n-webhook)
    // Atende Diana e qualquer novo vendedor criado pela conta do Édson!
    // =========================================================================
    if (govRoute === 'n8n_webhook' || reqUrl.startsWith('/api/n8n-webhook')) {
      let whBody = req.body;
      if (typeof whBody === 'string') {
        try { whBody = JSON.parse(whBody); } catch (e) { whBody = {}; }
      }
      whBody = whBody || {};

      const instanceName = String(whBody.instance || whBody?.data?.instance || req.query?.seller || '').toLowerCase().trim();
      const msgData = whBody.data || whBody;
      const remoteJid = String(msgData?.key?.remoteJid || msgData?.remoteJid || '');
      const fromMe = Boolean(msgData?.key?.fromMe);

      // Ignora grupos, status@broadcast ou sem número
      if (!instanceName || !remoteJid || remoteJid.includes('@g.us') || remoteJid.includes('status@broadcast')) {
        return res.status(200).json({ ok: true, ignored: true });
      }

      const rawPhone = remoteJid.replace(/@.*$/, '').replace(/\D/g, '');
      if (rawPhone.length < 8) {
        return res.status(200).json({ ok: true, ignored: true });
      }

      const pushName = String(msgData?.pushName || '').trim();
      const textMsg = String(
        msgData?.message?.conversation ||
        msgData?.message?.extendedTextMessage?.text ||
        msgData?.message?.imageMessage?.caption ||
        ''
      ).trim();

      const sellerUser = (govState?.users || []).find(
        u => !u.deleted_at && (u.key === instanceName || u.email.split('@')[0].toLowerCase() === instanceName)
      );
      const sellerUserId = sellerUser?.id || (instanceName === 'diana' ? '88888888-8888-8888-8888-888888888888' : OWNER_ID);
      const sellerPrefix = sellerUser?.prefix || `CRM-${instanceName.substring(0, 3).toUpperCase().padEnd(3, 'X')}-`;
      const nowIso = new Date().toISOString();
      const shortPhone8 = rawPhone.slice(-8);

      // Verifica se já existe lead com esse telefone na carteira deste vendedor
      const checkUrl = `${url}/rest/v1/leads?or=(vendedor_id.eq.${encodeURIComponent(instanceName)},user_id.eq.${encodeURIComponent(sellerUserId)})&phone=ilike.*${encodeURIComponent(shortPhone8)}*&limit=1`;
      const existingRes = await fetch(checkUrl, { headers });
      const existingList = existingRes.ok ? ((await existingRes.json()) || []) : [];

      if (Array.isArray(existingList) && existingList.length > 0) {
        const existingLead = existingList[0];
        const updatedNotes = textMsg
          ? `${existingLead.notes || ''}\n[${new Date().toLocaleString('pt-BR')}] ${fromMe ? 'Vendedor' : 'Cliente'}: ${textMsg}`.trim()
          : (existingLead.notes || '');
        await fetch(`${url}/rest/v1/leads?id=eq.${encodeURIComponent(existingLead.id)}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            last_interaction: nowIso,
            updated_at: nowIso,
            notes: updatedNotes.slice(-4000)
          })
        });
        return res.status(200).json({ ok: true, action: 'updated', lead_id: existingLead.id, seller: instanceName });
      }

      // Cria novo lead automaticamente no Kanban do vendedor
      const newLeadId = `${sellerPrefix}${rawPhone.slice(-6)}`;
      const clientName = (!fromMe && pushName && pushName.toLowerCase() !== instanceName)
        ? pushName
        : `Cliente WhatsApp (${rawPhone.slice(-4)})`;

      const newLeadPayload = {
        id: newLeadId,
        user_id: sellerUserId,
        vendedor_id: instanceName,
        name: clientName,
        phone: rawPhone,
        city: 'Brasil',
        stage: 'novos',
        temperature: 'morno',
        priority: 'MEDIA',
        value: 0,
        channel: 'whatsapp',
        pipeline: 'whatsapp',
        notes: textMsg ? `[WhatsApp ${new Date().toLocaleString('pt-BR')}]: ${textMsg}` : 'Lead capturado automaticamente via WhatsApp QR Code.',
        last_interaction: nowIso,
        created_at: nowIso,
        updated_at: nowIso
      };

      await fetch(`${url}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          ...headers,
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(newLeadPayload)
      });

      return res.status(200).json({ ok: true, action: 'created', lead_id: newLeadId, seller: instanceName });
    }

    // Super Admin Actions: Restaurar itens com Soft Delete ou registrar auditoria
    if (req.method === 'POST' || req.method === 'PATCH') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
      }
      body = body || {};
      const action = String(body.action || '').toLowerCase();

      if (action === 'restore' || action === 'restore_lead') {
        const targetLeadId = String(body.id || body.lead_id || '').trim();
        if (!targetLeadId) {
          return res.status(400).json({ success: false, error: 'ID do registro para restauração é obrigatório.' });
        }
        const restored = await restoreSoftDeletedLead({
          supabaseUrl: url,
          supabaseHeaders: headers,
          leadId: targetLeadId,
          actorUserId: OWNER_ID,
          req
        });
        return res.status(200).json({
          success: true,
          action: 'restore',
          lead: restored,
          message: `Registro "${restored.name || targetLeadId}" restaurado com sucesso pelo Super Administrador!`
        });
      }

      if (action === 'delete' || action === 'excluir') {
        const targetLeadId = String(body.id || body.lead_id || '').trim();
        const softDeleted = await performSoftDeleteLead({
          supabaseUrl: url,
          supabaseHeaders: headers,
          lead: { id: targetLeadId, name: body.name || targetLeadId },
          actorUserId: OWNER_ID,
          actorName: OWNER_NAME,
          req
        });
        return res.status(200).json({
          success: true,
          action: 'soft_delete',
          deleted_lead: softDeleted,
          message: 'Registro movido para a lixeira blindada (Soft Delete).'
        });
      }

      if (action === 'upsert' && body.id) {
        const updatePayload = { ...body };
        delete updatePayload.action;
        const nowIso = new Date().toISOString();
        updatePayload.updated_at = nowIso;

        const patchRes = await fetch(`${url}/rest/v1/leads?id=eq.${encodeURIComponent(body.id)}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updatePayload)
        });
        let updatedRows = [];
        if (patchRes.ok) {
          try { updatedRows = await patchRes.json(); } catch (e) {}
        }
        // Se o lead ainda não existia no Supabase (ex: novo lead criado por vendedora Diana), faz INSERT!
        if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
          const insertPayload = {
            created_at: nowIso,
            stage: 'prospeccao',
            value: 0,
            priority: 'MEDIA',
            ...updatePayload
          };
          await fetch(`${url}/rest/v1/leads`, {
            method: 'POST',
            headers: {
              ...headers,
              Prefer: 'resolution=merge-duplicates,return=representation'
            },
            body: JSON.stringify(insertPayload)
          });
        }

        await recordAuditLog({
          req,
          user_id: body.user_id || OWNER_ID,
          action: 'LEAD_STATUS_CHANGE',
          resource_type: 'lead',
          resource_id: body.id,
          details: { stage: body.stage, value: body.value, updated_by: body.vendedor_id || OWNER_NAME }
        });
        return res.status(200).json({ ok: true, success: true, message: 'Lead sincronizado com sucesso.' });
      }
    }

    const targetSeller = req.query.seller || req.query.vendedor || 'all';
    const includeDeleted = req.query.include_deleted === 'true';
    const limit = parseInt(req.query.limit || '5000', 10);

    let baseQueryUrl = `${url}/rest/v1/leads?select=*&order=value.desc`;
    if (targetSeller !== 'all' && targetSeller !== 'todos') {
      const matchedUser = (govState?.users || []).find(
        u => !u.deleted_at && (u.key === targetSeller || u.id === targetSeller)
      );
      if (matchedUser && matchedUser.id) {
        baseQueryUrl += `&or=(vendedor_id.eq.${encodeURIComponent(targetSeller)},user_id.eq.${encodeURIComponent(matchedUser.id)})`;
      } else {
        baseQueryUrl += `&vendedor_id=eq.${encodeURIComponent(targetSeller)}`;
      }
    }

    // Paginação paralela completa: consulta todas as páginas de 1000 do Supabase (até 6.000 leads)
    const maxPages = Math.min(6, Math.max(1, Math.ceil(limit / 1000)));
    const pagePromises = [];
    for (let p = 0; p < maxPages; p++) {
      pagePromises.push(
        fetch(`${baseQueryUrl}&offset=${p * 1000}&limit=1000`, { headers })
          .then(r => r.ok ? r.json() : [])
          .catch(() => [])
      );
    }

    const pagesData = await Promise.all(pagePromises);
    const rawLeads = pagesData.flat();
    // Filtra WHERE deleted_at IS NULL por padrão, mas permite ao Super Admin ver excluídos quando include_deleted=true
    const leads = filterActiveRecords(rawLeads, {
      includeDeleted,
      isSuperAdmin: true,
      govState,
      resourceType: 'lead'
    });

    const deletedLeads = filterActiveRecords(rawLeads, {
      includeDeleted: true,
      isSuperAdmin: true,
      govState,
      resourceType: 'lead'
    }).filter(l => Boolean(l.deleted_at));

    const totalPipeline = leads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
    const projectsLeads = leads.filter(l => (l.stage || '').toLowerCase() === 'projetos');
    const totalProjectsValue = projectsLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
    const vipLeads = leads.filter(l => (Number(l.value) || 0) >= 30000 || (l.priority || '').toUpperCase() === 'MAXIMA');
    const totalVipValue = vipLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);

    return res.status(200).json({
      success: true,
      owner: OWNER_NAME,
      role: 'super_admin',
      mode: 'super_admin_full_governance',
      metrics: {
        total_leads: leads.length,
        soft_deleted_count: deletedLeads.length,
        pipeline_total: totalPipeline,
        avg_ticket: leads.length > 0 ? (totalPipeline / leads.length) : 0,
        projetos_count: projectsLeads.length,
        projetos_value: totalProjectsValue,
        vip_count: vipLeads.length,
        vip_value: totalVipValue
      },
      leads,
      deleted_leads: deletedLeads,
      audit_logs: (govState.audit_logs || []).slice(0, 50)
    });
  } catch (err) {
    console.error('Erro /api/edson:', err);
    return res.status(500).json({ success: false, error: err.message || 'Erro interno.' });
  }
}
