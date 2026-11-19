import { supabaseDirectFetch as fetch } from '../lib/supabase-fetch.js';
// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/yasmim (ES Module)
// ENDPOINT EXCLUSIVO E BLINDADO DA YASMIM
// ZERO AUTENTICAÇÃO EXIGIDA NO CHATGPT (AUTENTICAÇÃO AUTOMÁTICA NO SERVIDOR)
// SUPORTE COMPLETO AO FUNIL WHATSAPP E GESTÃO DE ESTÁGIOS INCLUINDO DESISTIU
// ==============================================================================

import {
  loadGovernanceState,
  filterActiveRecords,
  performSoftDeleteLead,
  recordAuditLog
} from '../lib/governance.js';

const SELLER_USER_ID = 'bbbbbbbb-9999-4999-a999-999999999999';
const SELLER_NAME = 'Yasmim';
const SELLER_CREDENTIALS = { email: 'yasmim@piffpaff.com.br', password: 'Yasmim@2026' };
const DEFAULT_INSTAGRAM_LEADS_YASMIM = [];

let cachedToken = null;
let tokenExpiresAt = 0;

function cleanPhone(raw) {
  if (!raw) return '';
  return String(raw).replace(/\D/g, '');
}

function cleanInstagram(raw) {
  if (!raw) return '';
  return String(raw).replace(/^@/, '').trim().toLowerCase();
}

function formatBRL(val) {
  const num = Number(val) || 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatYMD(d) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d);
}

function addDays(numDays) {
  const nowInBrazil = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  nowInBrazil.setDate(nowInBrazil.getDate() + numDays);
  return formatYMD(nowInBrazil);
}

// Inteligência de Cadência de Follow-up Piff-Paff
function computeFollowupCadence({ notes, main_objection, commercial_moment, next_best_action, customDate, isNewLead }) {
  const todayStr = formatYMD(new Date());

  if (customDate && /^\d{4}-\d{2}-\d{2}$/.test(String(customDate).trim())) {
    const cDate = String(customDate).trim();
    if (cDate <= todayStr && isNewLead) {
      return {
        followup_date: addDays(1),
        followup_status: 'Próximo Contato (Amanhã)',
        reason: 'Contato já realizado hoje. Próximo follow-up agendado para o dia seguinte (+1 dia).'
      };
    }
    return {
      followup_date: cDate,
      followup_status: 'Data Agendada com Cliente',
      reason: 'Data específica combinada com o cliente.'
    };
  }

  const textContext = `${notes || ''} ${main_objection || ''} ${commercial_moment || ''} ${next_best_action || ''}`.toLowerCase();

  const isObra = textContext.includes('obra') ||
    textContext.includes('reforma') ||
    textContext.includes('reformando') ||
    textContext.includes('construção') ||
    textContext.includes('construcao') ||
    textContext.includes('construindo') ||
    textContext.includes('arquiteto') ||
    textContext.includes('contrapiso') ||
    textContext.includes('fundação') ||
    textContext.includes('reboco') ||
    textContext.includes('piso') ||
    textContext.includes('chaves') ||
    textContext.includes('entrega das chaves') ||
    textContext.includes('vai construir');

  if (isObra) {
    return {
      followup_date: addDays(35),
      followup_status: 'Acompanhamento de Obra (Sem Pressão)',
      reason: 'Cliente em fase de obras/construção. Cadência rápida pausada para acompanhamento estratégico em 35 dias.'
    };
  }

  const isProblema = textContext.includes('problema') ||
    textContext.includes('imprevisto') ||
    textContext.includes('urgência') ||
    textContext.includes('urgencia') ||
    textContext.includes('médico') ||
    textContext.includes('medico') ||
    textContext.includes('hospital') ||
    textContext.includes('luto') ||
    textContext.includes('faleceu') ||
    textContext.includes('viagem') ||
    textContext.includes('viajando') ||
    textContext.includes('viajar') ||
    textContext.includes('congelou') ||
    textContext.includes('pausou') ||
    textContext.includes('momento difícil') ||
    textContext.includes('pediu tempo') ||
    textContext.includes('pediu um tempo') ||
    textContext.includes('sem limite') ||
    textContext.includes('sem verba') ||
    textContext.includes('agora não posso');

  if (isProblema) {
    return {
      followup_date: addDays(21),
      followup_status: 'Aguardando Resolução / Problema',
      reason: 'Cliente relatou imprevisto/problema. Cadência rápida pausada para retorno empático em 21 dias.'
    };
  }

  const clientReplied = textContext.includes('cliente respondeu') ||
    textContext.includes('enviou mensagem') ||
    textContext.includes('mandou medidas') ||
    textContext.includes('pediu orçamento') ||
    textContext.includes('pediu catálogo') ||
    textContext.includes('pediu catalogo') ||
    textContext.includes('perguntou') ||
    textContext.includes('interessou');

  if (clientReplied) {
    return {
      followup_date: addDays(1),
      followup_status: 'Em Atendimento Ativo (Cliente Respondeu)',
      reason: 'Cliente respondeu/interagiu. Retorno prioritário em 24h.'
    };
  }

  const notesStr = String(notes || '');
  const countFollowups = (notesStr.match(/follow-up|tentativa|chamei|contato realizado|mensagem enviada/gi) || []).length;

  if (isNewLead || countFollowups === 0) {
    return {
      followup_date: addDays(1),
      followup_status: 'Cadência: Dia 1/3 (Primeiro Contato Consecutivo)',
      reason: 'Cliente novo na cadência: 1º contato da sequência de 3 dias seguidos.'
    };
  } else if (countFollowups === 1) {
    return {
      followup_date: addDays(1),
      followup_status: 'Cadência: Dia 2/3 (Segundo Contato Consecutivo)',
      reason: 'Cliente na cadência: 2º dia da sequência de 3 dias seguidos.'
    };
  } else if (countFollowups === 2) {
    return {
      followup_date: addDays(1),
      followup_status: 'Cadência: Dia 3/3 (Terceiro Contato Consecutivo)',
      reason: 'Cliente na cadência: 3º dia consecutivo de tentativa.'
    };
  } else if (countFollowups === 3) {
    return {
      followup_date: addDays(7),
      followup_status: 'Cadência: Semanal 1/2 (+7 dias)',
      reason: '1ª abordagem semanal (+7 dias) após sequência inicial.'
    };
  } else if (countFollowups === 4) {
    return {
      followup_date: addDays(7),
      followup_status: 'Cadência: Semanal 2/2 (+7 dias)',
      reason: '2ª abordagem semanal (+7 dias).'
    };
  } else if (countFollowups === 5) {
    return {
      followup_date: addDays(15),
      followup_status: 'Cadência: Quinzenal (+15 dias)',
      reason: 'Abordagem quinzenal (+15 dias).'
    };
  } else {
    return {
      followup_date: addDays(30),
      followup_status: 'Cadência: Mensal Recorrente (+30 dias)',
      reason: 'Reativação mensal recorrente (+30 dias).'
    };
  }
}

async function getAuthToken(supabaseUrl, publishableKey) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  try {
    const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': publishableKey,
        'Authorization': `Bearer ${publishableKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(SELLER_CREDENTIALS)
    });
    if (authRes.ok) {
      const authData = await authRes.json();
      if (authData && authData.access_token) {
        cachedToken = authData.access_token;
        tokenExpiresAt = now + ((authData.expires_in || 3600) * 1000);
        return cachedToken;
      }
    }
  } catch (e) {
    console.warn('Erro auth Yasmim:', e);
  }

  return publishableKey;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS' || req.method === 'HEAD') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Método não permitido.' });
  }

  try {
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://ukuaujxvdziiaxxuuidw.supabase.co').replace(/\/$/, '');
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_g-9BXuBM-xknIbIlpmF36A_ON6vnkuO';
    const authToken = await getAuthToken(supabaseUrl, publishableKey);

    const supabaseHeaders = {
      'apikey': publishableKey,
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const query = req.query || {};
    const action = (body.action || query.action || (req.method === 'DELETE' ? 'delete' : req.method === 'GET' ? 'list' : 'upsert')).toLowerCase();

    // =========================================================================
    // AÇÃO: CONSULTAR / CONTAR LEADS (GET ou POST action='list'/'count')
    // =========================================================================
    const isListOrCount = req.method === 'GET' ||
      action === 'list' || action === 'count' || action === 'summary' || action === 'relatorio' || action === 'consultar' || action === 'consulta' || action === 'buscar' || action === 'search' ||
      (!body.name && !body.phone && !body.instagram && !body.id && !body.notes && req.method === 'POST');

    if (isListOrCount) {
      let dbLeads = [];
      try {
        const fetchUrl = `${supabaseUrl}/rest/v1/leads?or=(user_id.eq.${encodeURIComponent(SELLER_USER_ID)},vendedor_id.eq.yasmim)&select=*&order=last_interaction.desc.nullslast&limit=3000`;
        const leadsRes = await fetch(fetchUrl, { headers: supabaseHeaders });
        if (leadsRes.ok) {
          dbLeads = (await leadsRes.json()) || [];
        }
      } catch (e) {
        console.warn('Erro leitura Supabase Yasmim:', e);
      }

      const { state: govState } = await loadGovernanceState();
      const mergedLeads = filterActiveRecords(dbLeads, {
        includeDeleted: false,
        isSuperAdmin: false,
        govState,
        resourceType: 'lead'
      });

      // Blindagem Anti-Duplicação por Telefone da Yasmim
      const stageRanks = { concluidas: 100, desistiu: 90, fechamento: 50, proposta: 40, projetos: 30, investigacao: 20, novos: 10 };
      const dedupMap = new Map();
      const phoneIndex = new Map();

      mergedLeads.forEach(lead => {
        if (!lead) return;
        const cp = cleanPhone(lead.phone);
        const last8 = (cp && cp.length >= 8 && cp.length <= 13) ? cp.slice(-8) : null;
        const leadId = String(lead.id || '').toUpperCase();

        let existingId = null;
        if (dedupMap.has(leadId)) {
          existingId = leadId;
        } else if (cp && phoneIndex.has(cp)) {
          existingId = phoneIndex.get(cp);
        } else if (last8 && phoneIndex.has(last8)) {
          existingId = phoneIndex.get(last8);
        }

        if (!existingId) {
          dedupMap.set(leadId, lead);
          if (cp) phoneIndex.set(cp, leadId);
          if (last8) phoneIndex.set(last8, leadId);
        } else {
          const canon = dedupMap.get(existingId);
          const rankC = stageRanks[canon.stage] || 10;
          const rankL = stageRanks[lead.stage] || 10;
          if (rankL > rankC) {
            canon.stage = lead.stage;
            canon.etapa_kanban = lead.etapa_kanban || lead.stage;
          }
          const valC = Number(canon.value) || 0;
          const valL = Number(lead.value) || 0;
          if (valL > valC) {
            canon.value = valL;
          }
          const isCGen = !canon.name || canon.name.startsWith('Lead WhatsApp') || canon.name.startsWith('WhatsApp');
          const isLGen = !lead.name || lead.name.startsWith('Lead WhatsApp') || lead.name.startsWith('WhatsApp');
          if (isCGen && !isLGen) {
            canon.name = lead.name;
          }
          if (lead.notes && (!canon.notes || !canon.notes.includes(lead.notes.slice(0, 30)))) {
            canon.notes = canon.notes ? `${canon.notes}\n\n${lead.notes}` : lead.notes;
          }
          if (canon.id && canon.id.includes('-LID-') && lead.id && lead.id.includes('-WA-')) {
            dedupMap.delete(existingId);
            canon.id = lead.id;
            dedupMap.set(String(lead.id).toUpperCase(), canon);
            if (cp) phoneIndex.set(cp, String(lead.id).toUpperCase());
            if (last8) phoneIndex.set(last8, String(lead.id).toUpperCase());
          }
        }
      });
      const uniqueMergedLeads = Array.from(dedupMap.values());

      let totalPipelineValue = 0;
      const stagesSummary = { novos: 0, investigacao: 0, projetos: 0, proposta: 0, fechamento: 0, concluidas: 0, desistiu: 0 };
      const temperaturesSummary = { quente: 0, morno: 0, frio: 0 };

      uniqueMergedLeads.forEach(l => {
        const v = Number(l.value) || 0;
        const st = (l.stage || 'novos').toLowerCase();
        if (st !== 'concluidas' && st !== 'desistiu') {
          totalPipelineValue += v;
        }
        if (stagesSummary[st] !== undefined) stagesSummary[st] += 1;
        else stagesSummary.novos += 1;

        const tp = (l.temperature || 'morno').toLowerCase();
        temperaturesSummary[tp] = (temperaturesSummary[tp] || 0) + 1;
      });

      let stageFilter = (query.stage || body.stage || '').toLowerCase().trim();
      let searchFilter = (query.search || query.q || query.name || query.cliente || body.search || body.q || body.name || body.cliente || '').toLowerCase().trim();
      let tempFilter = (query.temperature || body.temperature || '').toLowerCase().trim();

      const genericTerms = ['cliente', 'clientes', 'lead', 'leads', 'todos', 'tudo', 'all', 'cadastrado', 'cadastrados', 'geral', 'total', 'yasmim'];
      if (genericTerms.includes(searchFilter)) searchFilter = '';
      if (genericTerms.includes(stageFilter)) stageFilter = '';

      let filteredLeads = uniqueMergedLeads;
      if (stageFilter) {
        filteredLeads = filteredLeads.filter(l => (l.stage || '').toLowerCase().includes(stageFilter));
      }
      if (tempFilter) filteredLeads = filteredLeads.filter(l => (l.temperature || '').toLowerCase() === tempFilter);
      if (searchFilter) {
        const cleanSearch = searchFilter.replace(/^@/, '').trim();
        filteredLeads = filteredLeads.filter(l =>
          (l.name && l.name.toLowerCase().includes(cleanSearch)) ||
          (l.phone && l.phone.includes(cleanSearch)) ||
          (l.instagram && l.instagram.toLowerCase().includes(cleanSearch)) ||
          (l.city && l.city.toLowerCase().includes(cleanSearch))
        );
      }

      const isFiltered = Boolean(stageFilter || searchFilter || tempFilter);
      const leadsToDisplay = isFiltered ? filteredLeads : uniqueMergedLeads;
      const isCountOnly = action === 'count' || action === 'contar' || action === 'total' || query.count === 'true';

      const compactLead = (l) => ({
        ...l,
        id: l.id,
        name: l.name,
        phone: l.phone,
        instagram: l.instagram,
        city: l.city || 'Brasil',
        stage: l.stage,
        etapa_kanban: l.etapa_kanban || l.stage,
        value: Number(l.value) || 0,
        temperature: l.temperature || 'morno',
        priority: l.priority || 'MEDIA',
        commercial_line: l.commercial_line || 'Linha Premium',
        followup_status: l.followup_status || 'Agendado',
        followup_date: l.followup_date,
        channel: l.channel || 'whatsapp',
        pipeline: l.pipeline || 'whatsapp',
        user_id: SELLER_USER_ID,
        vendedor_id: 'yasmim',
        categoria: l.categoria || 1,
        notes: l.notes || ''
      });

      if (isCountOnly) {
        return res.status(200).json({
          success: true,
          seller: SELLER_NAME,
          total_leads: mergedLeads.length,
          pipeline_total_value: totalPipelineValue,
          pipeline_total_value_formatted: formatBRL(totalPipelineValue),
          stages_summary: stagesSummary,
          temperatures_summary: temperaturesSummary,
          message: `${SELLER_NAME} possui atualmente ${mergedLeads.length} clientes cadastrados no CRM com pipeline ativo de ${formatBRL(totalPipelineValue)}.`
        });
      }

      return res.status(200).json({
        success: true,
        seller: SELLER_NAME,
        total_leads: mergedLeads.length,
        filtered_count: leadsToDisplay.length,
        pipeline_total_value: totalPipelineValue,
        pipeline_total_value_formatted: formatBRL(totalPipelineValue),
        stages_summary: stagesSummary,
        temperatures_summary: temperaturesSummary,
        leads: leadsToDisplay.map(compactLead)
      });
    }

    // =========================================================================
    // AÇÕES DE ESCRITA: UPSERT / DELETE / REORGANIZE
    // =========================================================================
    const {
      id, name, phone, instagram, email, city, stage, value, temperature,
      commercial_moment, predominant_emotion, behavioral_profile, buying_signals,
      main_objection, gabriel_percentage, jhennifer_percentage, strategic_reading,
      next_best_action, desired_micro_advance, what_not_to_do, advance_probability,
      priority, commercial_line, category, followup_date, notes,
      channel, pipeline, origin, stage_instagram
    } = body;

    const normalizedPhone = cleanPhone(phone);
    const normalizedInsta = cleanInstagram(instagram);

    // 1. Busca todos os leads da Yasmim para correspondência exata
    let allLeads = [];
    try {
      const fetchUrl = `${supabaseUrl}/rest/v1/leads?or=(user_id.eq.${encodeURIComponent(SELLER_USER_ID)},vendedor_id.eq.yasmim)&select=*`;
      const leadsRes = await fetch(fetchUrl, { headers: supabaseHeaders });
      if (leadsRes.ok) {
        allLeads = (await leadsRes.json()) || [];
      }
    } catch (e) {
      console.warn('Erro leitura prévia Supabase Yasmim:', e);
    }

    let existingLead = null;
    const searchId = (id || '').toString().trim().toLowerCase();
    const searchPhoneLast8 = normalizedPhone ? normalizedPhone.slice(-8) : '';
    const searchInsta = normalizedInsta;
    const searchName = (name || '').toString().trim().toLowerCase();

    if (searchId) {
      existingLead = allLeads.find(l => String(l.id || '').toLowerCase() === searchId);
    }
    if (!existingLead && searchPhoneLast8) {
      existingLead = allLeads.find(l => cleanPhone(l.phone).slice(-8) === searchPhoneLast8);
    }
    if (!existingLead && searchInsta) {
      existingLead = allLeads.find(l => cleanInstagram(l.instagram) === searchInsta);
    }
    if (!existingLead && searchName && searchName.length >= 3) {
      existingLead = allLeads.find(l => String(l.name || '').toLowerCase() === searchName);
    }

    // Normalização segura de stage (INCLUINDO SUPORTE TOTAL A DESISTIU / JÁ COMPROU)
    const rawTargetStage = stage || stage_instagram;
    let targetStage = null;
    if (rawTargetStage) {
      const stageLower = String(rawTargetStage).toLowerCase().trim();
      if (stageLower === 'novo' || stageLower === 'novos') targetStage = 'novos';
      else if (['abordagem', 'investigacao', 'investigação', 'qualificacao', 'qualificação', 'diagnostico'].includes(stageLower)) targetStage = 'investigacao';
      else if (['conversa', 'projetos', 'projeto'].includes(stageLower)) targetStage = 'projetos';
      else if (['proposta', 'orcamento', 'orçamento'].includes(stageLower)) targetStage = 'proposta';
      else if (['fechamento', 'fechando'].includes(stageLower)) targetStage = 'fechamento';
      else if (['concluidas', 'concluida', 'concluídas', 'concluído', 'ganho', 'ganhos', 'venda', 'vendas'].includes(stageLower)) targetStage = 'concluidas';
      else if (['desistiu', 'desistencia', 'desistência', 'perdeu', 'perdido', 'perdidos', 'ja_comprou', 'já comprou', 'ja comprou', 'outra loja', 'outras lojas', 'concorrente'].some(x => stageLower.includes(x))) targetStage = 'desistiu';
      else targetStage = 'novos';
    }

    // EXCLUIR (SOFT DELETE UNIVERSAL)
    if (action === 'delete' || action === 'excluir') {
      if (!existingLead) {
        return res.status(404).json({ success: false, error: `Lead "${name || phone || id}" não foi encontrado na carteira de ${SELLER_NAME}.` });
      }
      const softDeleted = await performSoftDeleteLead({
        supabaseUrl,
        supabaseHeaders,
        lead: existingLead,
        actorUserId: SELLER_USER_ID,
        actorName: SELLER_NAME,
        req
      });
      return res.status(200).json({
        success: true,
        action: 'soft_delete',
        message: `Lead "${existingLead.name}" arquivado em Soft Delete com sucesso no funil de ${SELLER_NAME}!`,
        deleted_lead: softDeleted
      });
    }

    // UPSERT / ATUALIZAÇÃO
    if (!name && !normalizedPhone && !normalizedInsta && !id && !existingLead) {
      return res.status(400).json({ success: false, error: 'Forneça Nome, Telefone ou ID do contato.' });
    }

    let consolidatedNotes = existingLead ? existingLead.notes || '' : '';
    if (notes && String(notes).trim()) {
      const cleanNoteText = String(notes).trim();
      if (!consolidatedNotes.includes(cleanNoteText)) {
        const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        const newEntry = `[${timestamp} - IA (${SELLER_NAME})]: ${cleanNoteText}`;
        consolidatedNotes = consolidatedNotes ? `${consolidatedNotes}\n\n${newEntry}` : newEntry;
      }
    }

    const payload = {
      user_id: SELLER_USER_ID,
      vendedor_id: 'yasmim',
      updated_at: new Date().toISOString(),
      last_interaction: new Date().toISOString(),
      notes: consolidatedNotes
    };

    if (name) payload.name = name;
    if (normalizedPhone) payload.phone = normalizedPhone;
    if (normalizedInsta) payload.instagram = normalizedInsta;
    if (email) payload.email = email;
    if (city) payload.city = city;

    // Se o estágio foi explicitamente enviado, atualiza; senão MANTÉM o estágio existente
    if (targetStage) {
      payload.stage = targetStage;
      payload.etapa_kanban = targetStage === 'concluidas' ? 'Concluídas' : (targetStage === 'desistiu' ? 'Desistiu / Já comprou' : targetStage);
    } else if (existingLead && existingLead.stage) {
      payload.stage = existingLead.stage;
      payload.etapa_kanban = existingLead.etapa_kanban || existingLead.stage;
    } else {
      payload.stage = 'novos';
      payload.etapa_kanban = 'Novos';
    }

    if (value !== undefined && value !== null && !isNaN(Number(value))) {
      payload.value = Number(value);
    } else if (existingLead && existingLead.value !== undefined) {
      payload.value = existingLead.value;
    }

    if (temperature) {
      let targetTemp = String(temperature).toLowerCase().trim();
      if (targetTemp === 'alta' || targetTemp === 'hot') targetTemp = 'quente';
      else if (targetTemp === 'baixa' || targetTemp === 'cold') targetTemp = 'frio';
      else if (!['frio', 'morno', 'quente'].includes(targetTemp)) targetTemp = 'morno';
      payload.temperature = targetTemp;
    } else if (existingLead && existingLead.temperature) {
      payload.temperature = existingLead.temperature;
    }

    if (commercial_moment) {
      const momentLower = String(commercial_moment).toLowerCase().trim();
      payload.commercial_moment = ['pesquisa', 'comparacao', 'decisao', 'fechamento'].includes(momentLower) ? momentLower : 'pesquisa';
    } else if (existingLead && existingLead.commercial_moment) {
      payload.commercial_moment = existingLead.commercial_moment;
    }

    if (priority) payload.priority = priority;
    if (commercial_line) payload.commercial_line = commercial_line;
    if (next_best_action) payload.next_best_action = next_best_action;
    if (desired_micro_advance) payload.desired_micro_advance = desired_micro_advance;
    if (what_not_to_do) payload.what_not_to_do = what_not_to_do;
    if (predominant_emotion) payload.predominant_emotion = predominant_emotion;
    if (behavioral_profile) payload.behavioral_profile = behavioral_profile;
    if (buying_signals) payload.buying_signals = buying_signals;
    if (main_objection) payload.main_objection = main_objection;
    if (advance_probability) payload.advance_probability = advance_probability;

    // Follow-up inteligente
    const isNewLead = !existingLead;
    let targetFollowupDate = (followup_date !== undefined) ? followup_date : (existingLead ? existingLead.followup_date : undefined);
    if (payload.stage === 'concluidas' || payload.stage === 'desistiu' || commercial_line === 'Funcionário' || commercial_line === 'Fornecedor') {
      targetFollowupDate = '1970-01-01';
      payload.followup_disabled = true;
      payload.followup_status = 'Sem Follow-up';
    }

    const cadence = computeFollowupCadence({
      notes: consolidatedNotes,
      main_objection: payload.main_objection,
      commercial_moment: payload.commercial_moment,
      next_best_action: payload.next_best_action,
      customDate: targetFollowupDate,
      isNewLead
    });

    if (payload.stage !== 'concluidas' && payload.stage !== 'desistiu' && commercial_line !== 'Funcionário' && commercial_line !== 'Fornecedor') {
      payload.followup_date = cadence.followup_date;
      payload.followup_status = cadence.followup_status;
    } else {
      payload.followup_date = '1970-01-01';
      payload.followup_status = 'Sem Follow-up';
    }

    payload.channel = 'whatsapp';
    payload.pipeline = 'whatsapp';
    payload.categoria = (category !== undefined && category !== null) ? Number(category) : (existingLead?.categoria || 1);

    let resultData = null;

    if (existingLead && existingLead.id) {
      // ATUALIZAÇÃO (PATCH)
      const patchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(existingLead.id)}`, {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify(payload)
      });
      if (patchRes.ok) {
        const patchData = await patchRes.json();
        resultData = Array.isArray(patchData) ? patchData[0] : patchData;
      }
      if (!resultData) resultData = { ...existingLead, ...payload };
    } else {
      // INSERÇÃO (POST)
      const newLeadId = id || `CRM-YAS-WA-${normalizedPhone || Date.now()}`;
      payload.id = newLeadId;
      payload.created_at = new Date().toISOString();
      if (!payload.name) payload.name = normalizedPhone ? `Cliente (${normalizedPhone})` : 'Novo Cliente';

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(payload)
      });
      if (insertRes.ok) {
        const insertData = await insertRes.json();
        resultData = Array.isArray(insertData) ? insertData[0] : insertData;
      }
      if (!resultData) resultData = payload;
    }

    await recordAuditLog({
      req,
      user_id: SELLER_USER_ID,
      action: existingLead ? 'LEAD_UPDATE' : 'LEAD_CREATE',
      resource_type: 'lead',
      resource_id: resultData?.id || payload.id,
      details: {
        seller: SELLER_NAME,
        stage: payload.stage,
        value: payload.value,
        phone: payload.phone
      }
    });

    return res.status(200).json({
      success: true,
      action: existingLead ? (targetStage ? 'reorganize' : 'update') : 'create',
      seller: SELLER_NAME,
      lead: resultData,
      message: `Lead "${resultData?.name}" salvo com sucesso no funil de ${SELLER_NAME} na etapa "${payload.stage}"!`
    });
  } catch (err) {
    console.error('Erro /api/yasmim:', err);
    return res.status(500).json({ success: false, error: err.message || 'Erro interno.' });
  }
}
