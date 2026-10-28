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

  try {
    const { url, key } = getSupabaseConfig();
    const headers = {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    };

    const { state: govState } = await loadGovernanceState();

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
    const limit = parseInt(req.query.limit || '3000', 10);

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

    const [respPage1, respPage2] = await Promise.all([
      fetch(`${baseQueryUrl}&offset=0&limit=1000`, { headers }),
      limit > 1000 ? fetch(`${baseQueryUrl}&offset=1000&limit=1000`, { headers }) : Promise.resolve(null)
    ]);

    if (!respPage1.ok) {
      const errText = await respPage1.text();
      return res.status(500).json({ success: false, error: 'Erro ao consultar Supabase', details: errText });
    }

    const page1Leads = (await respPage1.json()) || [];
    const page2Leads = (respPage2 && respPage2.ok) ? ((await respPage2.json()) || []) : [];
    const rawLeads = [...page1Leads, ...page2Leads];
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
