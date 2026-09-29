// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/n8n-webhook (ES Module)
// WEBHOOK DIRETO MULTI-VENDEDOR (EVOLUTION API NATIVA + N8N + SUPABASE REALTIME)
// Suporta: Gabriel Lima, Felipe, Mayara e Eduardo
// ==============================================================================

// Mapeamento Oficial de Vendedores no Supabase CRM
const SELLERS = {
  gabriel: {
    user_id: 'a1111111-1111-1111-1111-111111111111',
    vendedor_id: 'gabriel',
    name: 'Gabriel Lima',
    leadPrefix: 'CRM-GAB-WA',
    origem: 'WhatsApp Gabriel'
  },
  felipe: {
    user_id: 'c3333333-3333-3333-3333-333333333333',
    vendedor_id: 'felipe',
    name: 'Felipe',
    leadPrefix: 'CRM-FEL-WA',
    origem: 'WhatsApp Felipe'
  },
  mayara: {
    user_id: 'b2222222-2222-2222-2222-222222222222',
    vendedor_id: 'mayara',
    name: 'Mayara',
    leadPrefix: 'CRM-MAY-WA',
    origem: 'WhatsApp Mayara'
  },
  eduardo: {
    user_id: 'd4444444-4444-4444-4444-444444444444',
    vendedor_id: 'eduardo',
    name: 'Eduardo',
    leadPrefix: 'CRM-EDU-WA',
    origem: 'WhatsApp Eduardo'
  }
};

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
      error: 'Método não permitido. Utilize POST para acionar o webhook.'
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

    // =======================================================================
    // 1. SUPORTE NATIVO EVOLUTION API v2 (messages.upsert) & N8N
    // =======================================================================
    const evoData = Array.isArray(body.data) ? body.data[0] : (body.data || body);
    const key = evoData?.key || {};

    // 1.1 Identificação de Direção da Mensagem: Enviada pelo Vendedor (fromMe = true) vs Recebida do Cliente (fromMe = false)
    const isFromMe = Boolean(key.fromMe === true || body.fromMe === true);

    // 1.2 Filtrar mensagens de grupos (@g.us) e status broadcast
    const rawJid = key.remoteJid || evoData?.remoteJid || body.remoteJid || '';
    if (rawJid.includes('@g.us') || rawJid.includes('status@broadcast')) {
      return res.status(200).json({
        success: true,
        ignored: true,
        reason: 'Mensagem de grupo ou status broadcast ignorada'
      });
    }

    // 1.3 Identificação do Vendedor de Destino (Gabriel, Felipe, Mayara ou Eduardo)
    const rawSeller = (
      body.vendedor_id ||
      body.vendedor ||
      body.instance ||
      req.query?.seller ||
      req.query?.instance ||
      ''
    ).toString().toLowerCase();

    let seller = SELLERS.gabriel;
    if (rawSeller.includes('eduardo')) {
      seller = SELLERS.eduardo;
    } else if (rawSeller.includes('mayara')) {
      seller = SELLERS.mayara;
    } else if (rawSeller.includes('felipe')) {
      seller = SELLERS.felipe;
    }

    // 1.4 Extração de Texto da Mensagem (suporta todos os formatos WhatsApp)
    const messageObj = evoData?.message || {};
    let extractedText =
      messageObj.conversation ||
      messageObj.extendedTextMessage?.text ||
      messageObj.imageMessage?.caption ||
      messageObj.videoMessage?.caption ||
      messageObj.documentMessage?.caption ||
      '';

    if (!extractedText) {
      if (messageObj.audioMessage) {
        extractedText = isFromMe ? `[Áudio enviado por ${seller.name}]` : '[Áudio recebido do cliente]';
      } else if (messageObj.imageMessage) {
        extractedText = isFromMe ? `[Foto enviada por ${seller.name}]` : '[Foto recebida do cliente]';
      } else if (messageObj.videoMessage) {
        extractedText = isFromMe ? `[Vídeo enviado por ${seller.name}]` : '[Vídeo recebido do cliente]';
      } else if (messageObj.documentMessage) {
        const docName = messageObj.documentMessage.fileName || 'arquivo';
        extractedText = isFromMe ? `[Documento enviado por ${seller.name}: ${docName}]` : `[Documento recebido do cliente: ${docName}]`;
      } else if (messageObj.stickerMessage) {
        extractedText = isFromMe ? `[Figurinha enviada por ${seller.name}]` : '[Figurinha enviada pelo cliente]';
      } else if (messageObj.locationMessage) {
        extractedText = isFromMe ? `[Localização compartilhada por ${seller.name}]` : '[Localização compartilhada pelo cliente]';
      } else if (messageObj.contactMessage) {
        extractedText = isFromMe ? `[Contato compartilhado por ${seller.name}]` : '[Contato compartilhado pelo cliente]';
      }
    }

    // 1.5 Extração de Telefone
    const rawPhone = body.telefone || body.phone || rawJid.replace(/@.*$/, '') || '';
    const phoneDigits = cleanPhone(rawPhone);

    if (!phoneDigits || phoneDigits.length < 8) {
      return res.status(200).json({
        success: true,
        ignored: true,
        reason: 'Número de telefone não identificado ou evento não transacional',
        event: body.event || 'unknown'
      });
    }

    // 1.6 Nome do Cliente
    const pushName = evoData?.pushName || '';
    const clientName = (
      body.nome ||
      body.client ||
      body.name ||
      (!isFromMe ? pushName : '') ||
      `Lead WhatsApp ${phoneDigits.slice(-4)}`
    ).toString().trim();

    // 1.7 Resumo e Intenção Comercial (Bidirecional)
    const messageDirectionLabel = isFromMe
      ? `Mensagem Enviada (${seller.name} ➡️ Cliente)`
      : `Mensagem Recebida (Cliente ➡️ ${seller.name})`;

    const interactionSummary = (
      body.resumo_interacao ||
      body.summary ||
      body.resumo ||
      extractedText ||
      (isFromMe ? 'Mensagem enviada no WhatsApp' : 'Mensagem recebida no WhatsApp')
    ).toString().trim();

    const clientIntent = (
      body.intencao ||
      body.intent ||
      body.predominant_emotion ||
      (isFromMe ? 'Acompanhamento do Vendedor' : (extractedText ? `Mensagem: ${extractedText.slice(0, 100)}` : 'Interesse em Mobiliário de Alto Padrão'))
    ).toString().trim();

    // =======================================================================
    // 2. CONEXÃO SUPABASE
    // =======================================================================
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

    // =======================================================================
    // 3. BUSCA DE LEAD EXISTENTE (POR TELEFONE OU ID DETERMINÍSTICO)
    // =======================================================================
    const phoneVariants = normalizePhoneVariants(phoneDigits);
    let existingLead = null;

    try {
      const orFilter = phoneVariants.map(p => `phone.eq.${p}`).join(',');
      const searchUrl = `${supabaseUrl}/rest/v1/leads?or=(${orFilter})&user_id=eq.${encodeURIComponent(seller.user_id)}&select=*&limit=1`;
      const searchRes = await fetch(searchUrl, { headers: supabaseHeaders });
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (Array.isArray(searchData) && searchData.length > 0) {
          existingLead = searchData[0];
        }
      }

      // Se não encontrou vinculado a este vendedor, busca se já existe cadastrado na base geral
      if (!existingLead) {
        const fallbackSearchUrl = `${supabaseUrl}/rest/v1/leads?or=(${orFilter})&select=*&limit=1`;
        const fbRes = await fetch(fallbackSearchUrl, { headers: supabaseHeaders });
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          if (Array.isArray(fbData) && fbData.length > 0) {
            existingLead = fbData[0];
          }
        }
      }
    } catch (errSearch) {
      console.warn('[Webhook] Aviso ao buscar telefone no Supabase:', errSearch);
    }

    const nowISO = new Date().toISOString();
    const nowBR = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    let resultAction = '';
    let finalLead = null;

    if (!existingLead) {
      // =======================================================================
      // 4. INSERT COM ID DETERMINÍSTICO (PREVINE DUPLICATAS POR RACE CONDITION)
      // =======================================================================
      const newLeadId = `${seller.leadPrefix}-${phoneDigits}`;
      const logNote = `[${nowBR} - ${messageDirectionLabel}]: ${interactionSummary}`;

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
        origem: seller.origem,
        channel: 'whatsapp',
        pipeline: 'whatsapp',
        vendedor_id: seller.vendedor_id,
        user_id: seller.user_id,
        value: 0,
        temperature: 'morno',
        commercial_moment: 'pesquisa',
        predominant_emotion: clientIntent,
        behavioral_profile: 'Consumidor Residencial Alto Padrão',
        buying_signals: `Interação capturada via WhatsApp: ${interactionSummary}`,
        main_objection: 'Definição de modelos e medidas',
        gabriel_percentage: seller.vendedor_id === 'gabriel' ? 100 : 0,
        jhennifer_percentage: 0,
        strategic_reading: `Lead recente capturado via WhatsApp (${seller.name}). Responder com abordagem consultiva.`,
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
        // Se falhou por conflito de chave primária (já inserido por webhook paralelo), faz PATCH
        const errText = await insertRes.text();
        console.warn('[Webhook] Insert inicial falhou (pode ser chave existente), tentando patch:', errText);

        const safePatch = {
          notes: logNote,
          last_interaction: nowISO,
          data_ultima_interacao: nowISO,
          updated_at: nowISO
        };
        const patchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(newLeadId)}`, {
          method: 'PATCH',
          headers: supabaseHeaders,
          body: JSON.stringify(safePatch)
        });
        finalLead = newLeadPayload;
        resultAction = patchRes.ok ? 'updated' : 'inserted';
      } else {
        const inserted = await insertRes.json();
        finalLead = Array.isArray(inserted) ? inserted[0] : newLeadPayload;
        resultAction = 'inserted';
      }
    } else {
      // =======================================================================
      // 5. UPDATE DE LEAD EXISTENTE (PRESERVA BANCO PRINCIPAL E HISTÓRICO)
      // =======================================================================
      const targetId = existingLead.id;
      const logNote = `\n\n[${nowBR} - ${messageDirectionLabel}]: ${interactionSummary}`;
      
      const previousNotes = existingLead.notes || '';
      let updatedNotes = previousNotes;
      const snippetToCheck = `]: ${interactionSummary}`.trim();
      if (!previousNotes.includes(snippetToCheck) || interactionSummary.length < 5) {
        updatedNotes = previousNotes ? `${previousNotes}${logNote}` : logNote.trim();
      }

      const updatePayload = {
        categoria: 1, // Garante que pertence ao Banco Principal
        vendedor_id: seller.vendedor_id,
        user_id: seller.user_id, // Garante vinculação correta ao vendedor
        origem: existingLead.origem || seller.origem,
        data_ultima_interacao: nowISO,
        last_interaction: nowISO,
        notes: updatedNotes,
        updated_at: nowISO
      };

      // Se o nome atual do lead for genérico e agora temos pushName do WhatsApp
      if (
        clientName &&
        (!existingLead.name || existingLead.name.startsWith('Lead ') || existingLead.name.startsWith('+55') || existingLead.name.startsWith('Cliente WhatsApp'))
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
        const safeUpdate = {
          user_id: seller.user_id,
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
    // 6. GRAVAR NA TABELA historico_interacoes
    // =======================================================================
    try {
      const historicoPayload = {
        lead_id: finalLead ? finalLead.id : null,
        telefone: phoneDigits,
        nome_cliente: finalLead ? finalLead.name : clientName,
        resumo_interacao: `[${isFromMe ? `${seller.name} ➡️ Cliente` : `Cliente ➡️ ${seller.name}`}] ${interactionSummary}`,
        intencao: clientIntent,
        origem: isFromMe ? `WhatsApp Enviado (${seller.name})` : seller.origem,
        vendedor_id: seller.vendedor_id,
        user_id: seller.user_id,
        created_at: nowISO
      };

      await fetch(`${supabaseUrl}/rest/v1/historico_interacoes`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(historicoPayload)
      });
    } catch (errHist) {
      console.warn('[Webhook] Aviso ao gravar historico_interacoes:', errHist);
    }

    // =======================================================================
    // 7. BROADCAST REALTIME (LATÊNCIA ZERO NA TELA DO VENDEDOR NO CRM)
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
                type: 'lead_whatsapp_interaction',
                isFromMe: isFromMe,
                direction: isFromMe ? 'outbound' : 'inbound',
                action: resultAction,
                sellerUserId: seller.user_id,
                seller: seller.vendedor_id,
                lead: finalLead
              }
            }
          ]
        })
      });
    } catch (errBroadcast) {
      // Postgres CDC garante persistência
    }

    // =======================================================================
    // 8. RESPOSTA DE SUCESSO AO EMISSOR
    // =======================================================================
    return res.status(200).json({
      success: true,
      action: resultAction,
      vendedor: seller.name,
      vendedor_id: seller.vendedor_id,
      user_id: seller.user_id,
      categoria: 1,
      etapa_kanban: finalLead ? (finalLead.stage || finalLead.etapa_kanban || 'Novos') : 'Novos',
      lead: {
        id: finalLead ? finalLead.id : null,
        name: finalLead ? finalLead.name : clientName,
        phone: finalLead ? finalLead.phone : phoneDigits,
        stage: finalLead ? (finalLead.stage || 'novos') : 'novos'
      },
      message: resultAction === 'inserted'
        ? `Lead "${clientName}" cadastrado no CRM de ${seller.name} via WhatsApp!`
        : `Lead "${clientName}" atualizado no CRM de ${seller.name} via WhatsApp!`
    });

  } catch (error) {
    console.error('[Webhook Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar webhook do WhatsApp.',
      details: error.message
    });
  }
}
