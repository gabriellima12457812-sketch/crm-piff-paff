// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/edson (ES Module)
// ENDPOINT EXCLUSIVO DA DIRETORIA • EDSON (DONO DA EMPRESA)
// VISÃO CONSOLIDADA TOTAL • 100% SOMENTE LEITURA (READ-ONLY)
// ==============================================================================

const OWNER_ID = '99999999-9999-9999-9999-999999999999';
const OWNER_NAME = 'Edson (Dono da Empresa)';

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || 'https://ukuaujxvdziiaxxuuidw.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_g-9BXuBM-xknIbIlpmF36A_ON6vnkuO';
  return { url, key };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Edson é estritamente SOMENTE LEITURA
  if (req.method !== 'GET') {
    return res.status(403).json({
      success: false,
      error: 'Acesso negado: O perfil executivo da diretoria (Edson) opera estritamente em modo SOMENTE LEITURA. Nenhuma alteração é permitida.'
    });
  }

  try {
    const { url, key } = getSupabaseConfig();
    const headers = {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    };

    const targetSeller = req.query.seller || req.query.vendedor || 'all';
    const limit = parseInt(req.query.limit || '2000', 10);

    let queryUrl = `${url}/rest/v1/leads?select=*&order=value.desc&limit=${limit}`;
    if (targetSeller !== 'all' && targetSeller !== 'todos') {
      queryUrl += `&vendedor_id=eq.${encodeURIComponent(targetSeller)}`;
    }

    const resp = await fetch(queryUrl, { headers });
    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(500).json({ success: false, error: 'Erro ao consultar Supabase', details: errText });
    }

    const leads = await resp.json();

    // Cálculo das métricas da diretoria
    const totalPipeline = leads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
    const projectsLeads = leads.filter(l => (l.stage || '').toLowerCase() === 'projetos');
    const totalProjectsValue = projectsLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
    const vipLeads = leads.filter(l => (Number(l.value) || 0) >= 30000 || (l.priority || '').toUpperCase() === 'MAXIMA');
    const totalVipValue = vipLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);

    return res.status(200).json({
      success: true,
      owner: OWNER_NAME,
      role: 'owner',
      mode: 'read_only',
      metrics: {
        total_leads: leads.length,
        pipeline_total: totalPipeline,
        avg_ticket: leads.length > 0 ? (totalPipeline / leads.length) : 0,
        projetos_count: projectsLeads.length,
        projetos_value: totalProjectsValue,
        vip_count: vipLeads.length,
        vip_value: totalVipValue
      },
      leads
    });
  } catch (err) {
    console.error('Erro /api/edson:', err);
    return res.status(500).json({ success: false, error: err.message || 'Erro interno.' });
  }
}
