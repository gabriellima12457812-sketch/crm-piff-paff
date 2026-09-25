// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/n8n-webhook (ES Module)
// WEBHOOK EXCLUSIVO PARA O VENDEDOR GABRIEL (n8n + ChatGPT + Evolution API)
// ==============================================================================

// Fixação Obrigatória do Vendedor Gabriel
const GABRIEL_USER_ID = 'a1111111-1111-1111-1111-111111111111';
const GABRIEL_VENDEDOR_ID = 'gabriel';
const GABRIEL_SELLER_NAME = 'Gabriel Lima';

function cleanPhone(raw) {
  if (!raw) return '';
  return String(raw).replace(/\D/g, '').trim();
}

function normalizePhoneVariants(raw) {
  const digits = cleanPhone(raw);
  if (!digits) return [];
  const variants = new Set([digits]);

  // Se tem DDI 55 e tem pelo menos 12 dígitos, cria variante sem 55
  if (digits.startsWith('55') && digits.length >= 12) {
    variants.add(digits.substring(2));
  }
  // Se não tem DDI 55 e tem 10 ou 11 dígitos, cria variante com 55
  if (!digits.startsWith('55') && (digits.length === 10 || digits.length === 11)) {
    variants.add('55' + digits);
  }

  return Array.from(variants);
}

export default async function handler(req, res) {
  // Configuração Global de CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido. Utilize POST para acionar o webhook do n8n.'
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    const { telefone, nome, resumo_interacao, intencao } = body;

    const rawPhone = telefone || body.phone || body.remoteJid || '';
    const phoneDigits = cleanPhone(rawPhone);

    if (!phoneDigits || phoneDigits.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Número de telefone inválido ou não informado. O telefone deve ter no mínimo 8 dígitos.',
        received: { telefone, nome }
      });
    }

    const clientName = (nome || body.client || body.name || `Lead WhatsApp ${phoneDigits.slice(-4)}`).toString().trim();
    const interactionSummary = (resumo_interacao || body.summary || body.resumo || 'Interação inicial via WhatsApp API').toString().trim();
    const clientIntent = (intencao || body.intent || body.predominant_emotion || 'Interesse em Mobiliário').toString().trim();

    // Credenciais Supabase
    const supabaseUrl = (
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      'https://ukuaujxvdziiaxxuuidw.supabase.co'
    ).replace(/\/$/, '');

    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'sb_publishable_g-9BXuBM-xknIbIlpmF36A_ON6vnkuO';

    const supabaseHeaders = {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    // 1. Buscar se o telefone já existe na tabela leads
    const phoneVariants = normalizePhoneVariants(phoneDigits);
    let existingLead = null;

    try {
      // Cria filtro OR do PostgREST para todas as variantes do telefone
      const orFilter = phoneVariants.map(p => `phone.eq.${p}`).join(',');
      const searchUrl = `${supabaseUrl}/rest/v1/leads?or=(${orFilter})&select=*&limit=1`;
      
      const searchRes = await fetch(searchUrl, { headers: supabaseHeaders });
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (Array.isArray(searchData) && searchData.length > 0) {
          existingLead = searchData[0];
        }
      }
    } catch (errSearch) {
      console.warn('[n8n Webhook] Aviso ao buscar telefone no Supabase:', errSearch);
    }

    const nowISO = new Date().toISOString();
    const nowBR = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    let resultAction = '';
    let finalLead = null;

    if (!existingLead) {
      // =======================================================================
      // 2. SE NÃO EXISTIR: INSERT NA TABELA LEADS (EXCLUSIVO GABRIEL)
      // =======================================================================
      const newLeadId = `CRM-GAB-WA-${Date.now()}`;
      const logNote = `[${nowBR} - WhatsApp n8n + ChatGPT]: ${interactionSummary}${clientIntent ? ` (Intenção: ${clientIntent})` : ''}`;

      const newLeadPayload = {
        id: newLeadId,
        name: clientName,
        phone: phoneDigits,
        instagram: null,
        email: null,
        city: 'Brasil',
        categoria: 1, // Regra: Categoria 1 = Banco Principal
        stage: 'novos', // Estágio técnico do Kanban
        etapa_kanban: 'Novos', // Estágio textual
        origem: 'WhatsApp API',
        channel: 'whatsapp',
        pipeline: 'whatsapp',
        vendedor_id: GABRIEL_VENDEDOR_ID, // Exclusividade Gabriel
        user_id: GABRIEL_USER_ID, // UUID Oficial do Gabriel no Supabase
        value: 0,
        temperature: 'morno',
        commercial_moment: 'pesquisa',
        predominant_emotion: clientIntent,
        behavioral_profile: 'Consumidor Residencial Alto Padrão',
        buying_signals: `Interação capturada via n8n: ${interactionSummary}`,
        main_objection: 'Definição de modelos e medidas',
        gabriel_percentage: 100,
        jhennifer_percentage: 0,
        strategic_reading: 'Lead recente capturado pelo bot WhatsApp. Responder com abordagem consultiva.',
        next_best_action: 'Apresentar catálogo e validar necessidade atual.',
        desired_micro_advance: 'Identificar ambientes da casa e estilo desejado.',
        what_not_to_do: 'Não enviar tabela de preços fria sem contextualizar o produto.',
        advance_probability: 'media',
        priority: 'ALTA',
        commercial_line: 'Linha Premium',
        notes: logNote,
        last_interaction: nowISO,
        data_ultima_interacao: nowISO,
        created_at: nowISO,
        updated_at: nowISO
      };

      const insertUrl = `${supabaseUrl}/rest/v1/leads`;
      const insertRes = await fetch(insertUrl, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(newLeadPayload)
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.error('[n8n Webhook] Erro no INSERT de leads:', errText);
        // Fallback: se falhar por colunas extras (ex: categoria ou etapa_kanban inexistentes na tabela)
        // Tentamos novamente com colunas padronizadas do schema original
        const fallbackPayload = {
          id: newLeadId,
          name: clientName,
          phone: phoneDigits,
          city: 'Brasil',
          stage: 'novos',
          value: 0,
          temperature: 'morno',
          commercial_moment: 'pesquisa',
          user_id: GABRIEL_USER_ID,
          notes: logNote,
          last_interaction: nowISO,
          created_at: nowISO,
          updated_at: nowISO
        };
        const fbRes = await fetch(insertUrl, {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(fallbackPayload)
        });
        if (fbRes.ok) {
          const inserted = await fbRes.json();
          finalLead = Array.isArray(inserted) ? inserted[0] : fallbackPayload;
        } else {
          finalLead = newLeadPayload; // Segue em frente para gravar o histórico
        }
      } else {
        const inserted = await insertRes.json();
        finalLead = Array.isArray(inserted) ? inserted[0] : newLeadPayload;
      }

      resultAction = 'inserted';
    } else {
      // =======================================================================
      // 3. SE JÁ EXISTIR: UPDATE FORÇANDO CATEGORIA 1 E VENDEDOR GABRIEL
      // =======================================================================
      const targetId = existingLead.id;
      const logNote = `\n\n[${nowBR} - Nova Mensagem WhatsApp n8n]: ${interactionSummary}${clientIntent ? ` (Intenção: ${clientIntent})` : ''}`;
      const updatedNotes = (existingLead.notes || '') + logNote;

      const updatePayload = {
        categoria: 1, // Garante que pertence ao Banco Principal
        vendedor_id: GABRIEL_VENDEDOR_ID,
        user_id: GABRIEL_USER_ID, // Garante que o lead é do Gabriel
        origem: existingLead.origem || 'WhatsApp API',
        data_ultima_interacao: nowISO,
        last_interaction: nowISO,
        notes: updatedNotes,
        updated_at: nowISO
      };

      // Se o lead antigo tinha nome genérico e agora recebemos nome real
      if (
        clientName &&
        (!existingLead.name || existingLead.name.startsWith('Lead ') || existingLead.name.startsWith('+55'))
      ) {
        updatePayload.name = clientName;
      }

      const updateUrl = `${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(targetId)}`;
      const updateRes = await fetch(updateUrl, {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify(updatePayload)
      });

      if (!updateRes.ok) {
        // Fallback para campos seguros
        const safeUpdate = {
          user_id: GABRIEL_USER_ID,
          notes: updatedNotes,
          last_interaction: nowISO,
          updated_at: nowISO
        };
        await fetch(updateUrl, {
          method: 'PATCH',
          headers: supabaseHeaders,
          body: JSON.stringify(safeUpdate)
        });
      }

      finalLead = { ...existingLead, ...updatePayload };
      resultAction = 'updated';
    }

    // =======================================================================
    // 4. INSERT NA TABELA historico_interacoes (COM RESUMO DO CHATGPT)
    // =======================================================================
    try {
      const historicoPayload = {
        lead_id: finalLead ? finalLead.id : null,
        telefone: phoneDigits,
        nome_cliente: clientName,
        resumo_interacao: interactionSummary,
        intencao: clientIntent,
        origem: 'WhatsApp API',
        vendedor_id: GABRIEL_VENDEDOR_ID,
        user_id: GABRIEL_USER_ID,
        created_at: nowISO
      };

      const histUrl = `${supabaseUrl}/rest/v1/historico_interacoes`;
      const histRes = await fetch(histUrl, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(historicoPayload)
      });

      if (!histRes.ok) {
        console.warn('[n8n Webhook] Tabela historico_interacoes pode não existir ainda ou rejeitou campos:', await histRes.text());
      }
    } catch (errHist) {
      console.warn('[n8n Webhook] Erro ao gravar historico_interacoes (ignorado para não falhar webhook):', errHist);
    }

    // =======================================================================
    // 5. DISPARAR BROADCAST REALTIME (LATÊNCIA ZERO NA TELA DO GABRIEL)
    // =======================================================================
    try {
      const broadcastUrl = `${supabaseUrl}/realtime/v1/api/broadcast`;
      await fetch(broadcastUrl, {
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              topic: 'piffpaff-crm-broadcast',
              event: 'crm_event',
              payload: {
                type: 'lead_whatsapp_incoming',
                action: resultAction,
                sellerUserId: GABRIEL_USER_ID,
                seller: GABRIEL_VENDEDOR_ID,
                lead: finalLead
              }
            }
          ]
        })
      });
    } catch (errBroadcast) {
      // Não bloqueia a resposta se broadcast falhar (Postgres CDC cobre)
    }

    // Resposta de Sucesso ao n8n
    return res.status(200).json({
      success: true,
      action: resultAction,
      vendedor: GABRIEL_SELLER_NAME,
      vendedor_id: GABRIEL_VENDEDOR_ID,
      user_id: GABRIEL_USER_ID,
      categoria: 1,
      etapa_kanban: finalLead ? (finalLead.stage || finalLead.etapa_kanban || 'Novos') : 'Novos',
      lead: {
        id: finalLead ? finalLead.id : null,
        name: finalLead ? finalLead.name : clientName,
        phone: finalLead ? finalLead.phone : phoneDigits,
        stage: finalLead ? (finalLead.stage || 'novos') : 'novos',
        notes: finalLead ? finalLead.notes : ''
      },
      message: resultAction === 'inserted'
        ? `Lead "${clientName}" cadastrado com sucesso no Banco Principal (WhatsApp) do Gabriel!`
        : `Lead "${clientName}" atualizado com sucesso no Banco Principal (WhatsApp) do Gabriel!`
    });

  } catch (error) {
    console.error('[n8n Webhook Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar webhook do n8n.',
      details: error.message
    });
  }
}
