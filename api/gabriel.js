// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/gabriel (ES Module)
// ENDPOINT EXCLUSIVO E BLINDADO DO GABRIEL LIMA
// ZERO AUTENTICAÇÃO EXIGIDA NO CHATGPT (AUTENTICAÇÃO AUTOMÁTICA NO SERVIDOR)
// ==============================================================================

const SELLER_USER_ID = 'a1111111-1111-1111-1111-111111111111';
const SELLER_NAME = 'Gabriel Lima';
const SELLER_CREDENTIALS = { email: 'gabriel@piffpaff.com.br', password: 'Gabriel@2026' };

// Leads oficiais do funil de Instagram Direct do Gabriel no CRM
const DEFAULT_INSTAGRAM_LEADS_GABRIEL = [
  {
    id: 'insta-gab-001',
    name: 'Marisa Roux',
    instagram: 'marisaroux',
    city: 'Balneário Camboriú - SC',
    stage: 'conversa',
    stage_label: 'Em Conversa',
    channel: 'instagram',
    pipeline: 'instagram',
    value: 45000,
    temperature: 'quente',
    priority: 'ALTA',
    commercial_line: 'Linha Premium',
    followup_status: 'Chamar Hoje',
    notes: 'Contato via Direct. Interessada em mobiliário para varanda gourmet e piscina. Aguardando WhatsApp para envio do layout.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'insta-gab-002',
    name: 'Carla Guimarães',
    instagram: 'carlaguimaraes_decor',
    city: 'Belo Horizonte - MG',
    stage: 'novo',
    stage_label: 'Novo Lead',
    channel: 'instagram',
    pipeline: 'instagram',
    value: 42000,
    temperature: 'quente',
    priority: 'ALTA',
    commercial_line: 'Linha Premium',
    followup_status: 'Chamar Hoje',
    notes: 'Perguntou valores e prazos da chaise Tulum no direct do Instagram.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'insta-gab-003',
    name: 'Natmassa',
    instagram: 'natmassa',
    city: 'Curitiba - PR',
    stage: 'abordagem',
    stage_label: 'Abordagem Inicial',
    channel: 'instagram',
    pipeline: 'instagram',
    value: 60000,
    temperature: 'morno',
    priority: 'ALTA',
    commercial_line: 'Linha Premium',
    followup_status: 'Agendado',
    notes: 'Enviou mensagem sobre acabamentos náuticos em corda terracota.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'insta-gab-004',
    name: 'Rogério Augusto',
    instagram: 'rogeriosouzaguitar',
    city: 'São Paulo - SP',
    stage: 'conversa',
    stage_label: 'Em Conversa',
    channel: 'instagram',
    pipeline: 'instagram',
    value: 38000,
    temperature: 'morno',
    priority: 'MEDIA',
    commercial_line: 'Linha Standard',
    followup_status: 'Chamar Hoje',
    notes: 'Pediu catálogo digital de sofás modulares.',
  }
];

// Leads oficiais da Base de Resgate (Quarentena de Ex-Vendedor)
const DEFAULT_QUARANTINE_LEADS = [
  {
    id: 'resgate-001',
    name: 'Dr. Roberto Silveira',
    phone: '11984443322',
    instagram: 'dr.robertosilveira',
    city: 'Barueri - SP (Alphaville)',
    stage: 'a_contatar',
    stage_label: 'A Contatar',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 85000,
    temperature: 'quente',
    priority: 'ALTA',
    commercial_line: 'Linha Premium',
    followup_status: 'A Contatar',
    notes: '[Ex-Vendedor Carlos]: Cliente fez orçamento em abril para área gourmet e piscina. Negociação parou por falta de retorno do vendedor. Oportunidade quente para resgate com nova abordagem consultiva.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'resgate-002',
    name: 'Fabiana Montez (Arquiteta)',
    phone: '21971239988',
    instagram: 'fabianamontez.arq',
    city: 'Rio de Janeiro - RJ (Barra da Tijuca)',
    stage: 'a_contatar',
    stage_label: 'A Contatar',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 120000,
    temperature: 'quente',
    priority: 'MAXIMA',
    commercial_line: 'Linha Internacional',
    followup_status: 'A Contatar',
    notes: '[Ex-Vendedor Carlos]: Especificação de 6 espreguiçadeiras e conjunto lounge. Projeto aprovado pelo cliente final, aguardando contato direto da fábrica.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'resgate-003',
    name: 'Condomínio Reserva dos Pássaros (Síndico Marcos)',
    phone: '41998877665',
    instagram: '',
    city: 'Curitiba - PR',
    stage: 'tentativa_resgate',
    stage_label: 'Tentativa de Resgate',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 165000,
    temperature: 'morno',
    priority: 'ALTA',
    commercial_line: 'Corporativo / Áreas Comuns',
    followup_status: 'Em Sondagem',
    notes: '[Ex-Vendedor Carlos]: Primeira abordagem de resgate feita. Síndico pediu para apresentar nova proposta com frete incluso diretamente à comissão de obras.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'resgate-004',
    name: 'Helena Albuquerque',
    phone: '31991122334',
    instagram: 'helena.albuquerque.decor',
    city: 'Nova Lima - MG',
    stage: 'tentativa_resgate',
    stage_label: 'Tentativa de Resgate',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 54000,
    temperature: 'morno',
    priority: 'MEDIA',
    commercial_line: 'Linha Premium',
    followup_status: 'Aguardando Catálogo',
    notes: '[Ex-Vendedor Carlos]: Contato realizado via ligação. Cliente gostou da linha alumínio naval e pediu catálogo atualizado para fechar antes do verão.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'resgate-005',
    name: 'Maurício Vianna',
    phone: '47996554433',
    instagram: 'mauriciovianna_eng',
    city: 'Itapema - SC',
    stage: 'a_contatar',
    stage_label: 'A Contatar',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 92000,
    temperature: 'quente',
    priority: 'ALTA',
    commercial_line: 'Linha Premium',
    followup_status: 'A Contatar',
    notes: '[Ex-Vendedor Carlos]: Casa de praia com varanda ampla. Interessado em mesa 10 lugares com cadeiras em corda terracota.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'resgate-006',
    name: 'Beatriz Vasconcelos',
    phone: '61988990011',
    instagram: 'bvasconcelos_df',
    city: 'Brasília - DF (Lago Sul)',
    stage: 'a_contatar',
    stage_label: 'A Contatar',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 78000,
    temperature: 'morno',
    priority: 'ALTA',
    commercial_line: 'Linha Standard',
    followup_status: 'A Contatar',
    notes: '[Ex-Vendedor Carlos]: Pediu amostras de tecido impermeável e acabamentos náuticos. Sem contato há mais de 45 dias.',
    user_id: SELLER_USER_ID
  }
];

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

  // 1. Data combinada explícita (pelo usuário ou pelo ChatGPT)
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

  // EXCEÇÃO 1: CLIENTE EM OBRA / REFORMA / CONSTRUÇÃO
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

  // EXCEÇÃO 2: GEROU ALGUM PROBLEMA / IMPREVISTO / LUTO / VIAGEM
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

  // EXCEÇÃO 3: CLIENTE ENTROU EM CONTATO / RESPONDEU
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

  // REGRA DE CADÊNCIA PADRÃO:
  // 3 dias seguidos -> 2x de 7 em 7 dias -> 1x com 15 dias -> 1x por mês
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
    console.warn('Erro auth Gabriel:', e);
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
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://hqqzumdscdjleaedguzh.supabase.co').replace(/\/$/, '');
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4jxc0p-L34exKc-z3ws2CQ_YH0F_DJ8';
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
    // AÇÃO 1: LOCALIZAR LEAD NO INSTAGRAM (findInstagramLead)
    // =========================================================================
    const isFindInstagram = action === 'findinstagramlead' || action === 'find_instagram' || action === 'buscar_instagram' || action === 'localizar_instagram';
    if (isFindInstagram) {
      let dbLeads = [];
      try {
        const fetchUrl = `${supabaseUrl}/rest/v1/leads?user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*&order=created_at.desc`;
        const leadsRes = await fetch(fetchUrl, { headers: supabaseHeaders });
        if (leadsRes.ok) {
          dbLeads = (await leadsRes.json()) || [];
        }
      } catch (e) {
        console.warn('Erro leitura Supabase no findInstagramLead:', e);
      }

      // Mescla com a lista padrão em memória de leads do Instagram deste vendedor
      const existingIds = new Set(dbLeads.map(l => l.id));
      const existingInstas = new Set(dbLeads.map(l => cleanInstagram(l.instagram)));
      const mergedLeads = [...dbLeads];
      (DEFAULT_INSTAGRAM_LEADS_GABRIEL || []).forEach(instaLead => {
        const cInsta = cleanInstagram(instaLead.instagram);
        if (!existingIds.has(instaLead.id) && !existingInstas.has(cInsta)) {
          mergedLeads.push(instaLead);
        }
      });

      // Detecção estrita de Lead no Funil Instagram
      function isInstagramCard(l) {
        if (!l) return false;
        const notesStr = String(l.notes || '').toLowerCase();
        if (
          notesStr.includes('transição de funil') ||
          notesStr.includes('transicao de funil') ||
          notesStr.includes('migrado com sucesso de "leads instagram"') ||
          notesStr.includes('migrado com sucesso de "leads instagram" para "negociações whatsapp"') ||
          notesStr.includes('migrado com sucesso de "leads instagram" para "negociacoes whatsapp"')
        ) {
          return false;
        }
        if (l.channel === 'whatsapp' || l.pipeline === 'whatsapp') return false;
        if (l.channel === 'instagram' || l.pipeline === 'instagram') return true;
        const idLower = String(l.id || '').toLowerCase();
        if (idLower.startsWith('insta-') || idLower.startsWith('crm-gab-')) return true;
        const st = String(l.stage || '').toLowerCase().trim();
        if (['novo', 'abordagem', 'conversa'].includes(st)) return true;
        const cInsta = cleanInstagram(l.instagram);
        if (cInsta.length > 1 && !cleanPhone(l.phone)) return true;
        if (notesStr.includes('[canal: instagram]') || notesStr.includes('direct') || notesStr.includes('instagram direct')) return true;
        return false;
      }

      const instagramLeadsList = mergedLeads.filter(isInstagramCard);

      const searchId = (body.leadId || body.id || query.leadId || query.id || '').toString().trim().toLowerCase();
      const searchInsta = cleanInstagram(body.instagram || query.instagram || body.username || query.username);
      const searchPhone = cleanPhone(body.phone || query.phone);
      const searchName = (body.name || query.name || body.search || query.search || body.q || query.q || '').toString().trim().toLowerCase();

      let matchedLead = null;

      if (searchId) {
        matchedLead = instagramLeadsList.find(l => String(l.id || '').toLowerCase() === searchId);
      }
      if (!matchedLead && searchInsta) {
        matchedLead = instagramLeadsList.find(l => {
          const lInsta = cleanInstagram(l.instagram);
          if (!lInsta) return false;
          return lInsta === searchInsta || (lInsta.length >= 3 && searchInsta.includes(lInsta)) || (searchInsta.length >= 3 && lInsta.includes(searchInsta));
        });
      }
      if (!matchedLead && searchPhone) {
        matchedLead = instagramLeadsList.find(l => {
          const lp = cleanPhone(l.phone);
          return Boolean(lp) && lp === searchPhone;
        });
      }
      if (!matchedLead && searchName && searchName.length > 2) {
        matchedLead = instagramLeadsList.find(l => String(l.name || '').toLowerCase().includes(searchName));
      }

      if (matchedLead) {
        return res.status(200).json({
          success: true,
          found: true,
          action: 'findInstagramLead',
          seller: SELLER_NAME,
          funnel: 'Leads Instagram (Prospecção)',
          lead: {
            id: matchedLead.id,
            name: matchedLead.name,
            phone: matchedLead.phone || null,
            instagram: matchedLead.instagram ? `@${cleanInstagram(matchedLead.instagram)}` : null,
            city: matchedLead.city || null,
            stage: matchedLead.stage,
            stage_label: matchedLead.stage_label || matchedLead.stage,
            value: matchedLead.value || 0,
            temperature: matchedLead.temperature || 'morno',
            priority: matchedLead.priority || 'ALTA',
            commercial_line: matchedLead.commercial_line || 'Linha Premium',
            notes: matchedLead.notes || ''
          },
          message: `Lead "${matchedLead.name}" (@${cleanInstagram(matchedLead.instagram)}) localizado no funil de Leads Instagram de ${SELLER_NAME}. Pronto para migração para o WhatsApp.`
        });
      } else {
        return res.status(200).json({
          success: true,
          found: false,
          action: 'findInstagramLead',
          seller: SELLER_NAME,
          lead: null,
          total_instagram_leads: instagramLeadsList.length,
          message: `Nenhum lead correspondente encontrado no funil Leads Instagram de ${SELLER_NAME}.`
        });
      }
    }

    // =========================================================================
    // AÇÃO 2: MIGRAR LEAD DO INSTAGRAM PARA O WHATSAPP (moveInstagramLeadToWhatsApp)
    // =========================================================================
    const isMoveToWhatsApp = action === 'moveinstagramleadtowhatsapp' || action === 'move_to_whatsapp' || action === 'moveto_whatsapp' || action === 'transferir_para_whatsapp' || action === 'migrar_instagram_whatsapp';
    if (isMoveToWhatsApp) {
      const inputPhone = cleanPhone(body.phone || query.phone || '');
      const inputInsta = cleanInstagram(body.instagram || query.instagram || body.username || query.username || '');
      const inputId = (body.leadId || body.id || query.leadId || query.id || '').toString().trim();
      const inputName = (body.name || query.name || '').toString().trim();
      const inputValue = (body.value !== undefined && body.value !== null && !isNaN(Number(body.value)))
        ? Number(body.value)
        : (query.value !== undefined && !isNaN(Number(query.value)) ? Number(query.value) : undefined);
      const transitionNote = (body.transitionNote || body.motivo || body.notes || query.transitionNote || '').toString().trim();

      if (!inputPhone) {
        return res.status(400).json({
          success: false,
          error: 'O número de telefone WhatsApp é obrigatório para migrar o lead para o funil de Negociações WhatsApp.'
        });
      }

      // Normalização do estágio de destino no WhatsApp
      let destStage = (body.destinationStage || body.stage || query.destinationStage || 'investigacao').toLowerCase().trim();
      if (destStage === 'novo' || destStage === 'novos') destStage = 'novos';
      else if (destStage === 'abordagem' || destStage === 'qualificacao' || destStage === 'qualificado' || destStage === 'diagnostico' || destStage === 'investigacao') destStage = 'investigacao';
      else if (destStage === 'conversa' || destStage === 'projetos' || destStage === 'projeto') destStage = 'projetos';
      else if (destStage === 'proposta' || destStage === 'orcamento') destStage = 'proposta';
      else if (destStage === 'fechamento') destStage = 'fechamento';
      else if (destStage === 'concluidas' || destStage === 'concluida' || destStage === 'ganho' || destStage === 'fechado') destStage = 'concluidas';
      else destStage = 'investigacao';

      // 1. Busca todos os leads do vendedor no Supabase
      let dbLeads = [];
      try {
        const fetchUrl = `${supabaseUrl}/rest/v1/leads?user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*`;
        const leadsRes = await fetch(fetchUrl, { headers: supabaseHeaders });
        if (leadsRes.ok) {
          dbLeads = (await leadsRes.json()) || [];
        }
      } catch (e) {
        console.warn('Erro leitura Supabase no moveInstagramLeadToWhatsApp:', e);
      }

      // Mescla com os leads em memória caso não persistidos ainda
      const existingIds = new Set(dbLeads.map(l => l.id));
      const existingInstas = new Set(dbLeads.map(l => cleanInstagram(l.instagram)));
      const mergedLeads = [...dbLeads];
      (DEFAULT_INSTAGRAM_LEADS_GABRIEL || []).forEach(instaLead => {
        const cInsta = cleanInstagram(instaLead.instagram);
        if (!existingIds.has(instaLead.id) && !existingInstas.has(cInsta)) {
          mergedLeads.push(instaLead);
        }
      });

      // 2. Localiza o lead original do Instagram
      let sourceLead = null;
      if (inputId) {
        sourceLead = mergedLeads.find(l => String(l.id || '').toLowerCase() === inputId.toLowerCase());
      }
      if (!sourceLead && inputInsta) {
        sourceLead = mergedLeads.find(l => {
          const lInsta = cleanInstagram(l.instagram);
          if (!lInsta) return false;
          return lInsta === inputInsta || (lInsta.length >= 3 && inputInsta.includes(lInsta)) || (inputInsta.length >= 3 && lInsta.includes(inputInsta));
        });
      }
      if (!sourceLead && inputPhone) {
        sourceLead = mergedLeads.find(l => {
          const lp = cleanPhone(l.phone);
          return Boolean(lp) && lp === inputPhone;
        });
      }
      if (!sourceLead && inputName && inputName.length > 2) {
        sourceLead = mergedLeads.find(l => String(l.name || '').toLowerCase().includes(inputName.toLowerCase()));
      }

      // 3. Validação de Duplicidade: Verifica se JÁ existe uma negociação no WhatsApp com o mesmo telefone
      const existingWhatsAppLead = dbLeads.find(l => {
        const p = cleanPhone(l.phone);
        if (!p || p !== inputPhone) return false;
        if (sourceLead && l.id === sourceLead.id) return false;
        return true;
      });

      const nowFormatted = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const auditLog = `[${nowFormatted} - Transição de Funil (IA ChatGPT - ${SELLER_NAME})]: Lead migrado com sucesso de "Leads Instagram" para "Negociações WhatsApp" com status QUALIFICADO.${existingWhatsAppLead ? ' (MESCLADO COM NEGOCIAÇÃO WHATSAPP EXISTENTE)' : ''} WhatsApp: ${inputPhone}. Origem: Instagram.${transitionNote ? ' Obs: ' + transitionNote : ''}`;

      let resultLead = null;
      let finalMessage = '';
      let isMerged = false;
      let sourceLeadId = sourceLead ? sourceLead.id : (inputId || null);
      let destinationLeadId = null;

      // CENÁRIO A: JÁ EXISTE NEGOCIAÇÃO NO WHATSAPP COM ESTE TELEFONE -> ATUALIZAR / MESCLAR (SEM DUPLICAR)
      if (existingWhatsAppLead) {
        isMerged = true;
        destinationLeadId = existingWhatsAppLead.id;

        let consolidatedNotes = existingWhatsAppLead.notes || '';
        if (sourceLead && sourceLead.notes && !consolidatedNotes.includes(sourceLead.notes)) {
          consolidatedNotes = `${consolidatedNotes}\n\n[Histórico Instagram]: ${sourceLead.notes}`;
        }
        consolidatedNotes = consolidatedNotes ? `${consolidatedNotes}\n\n${auditLog}` : auditLog;

        const mergePayload = {
          user_id: SELLER_USER_ID,
          stage: destStage,
          phone: inputPhone,
          updated_at: new Date().toISOString(),
          last_interaction: new Date().toISOString(),
          followup_date: addDays(1),
          notes: consolidatedNotes
        };

        if (inputName) mergePayload.name = inputName;
        if (inputInsta) mergePayload.instagram = inputInsta;
        if (inputValue !== undefined) mergePayload.value = inputValue;
        if (existingWhatsAppLead.temperature !== 'quente') mergePayload.temperature = 'quente';

        const patchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(existingWhatsAppLead.id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}`, {
          method: 'PATCH',
          headers: supabaseHeaders,
          body: JSON.stringify(mergePayload)
        });

        if (patchRes.ok) {
          const patchData = await patchRes.json();
          resultLead = Array.isArray(patchData) ? patchData[0] : patchData;
        }
        if (!resultLead) resultLead = { ...existingWhatsAppLead, ...mergePayload };

        // Remove o card antigo do Instagram do Supabase se existia com ID diferente
        if (sourceLead && sourceLead.id !== existingWhatsAppLead.id && dbLeads.some(l => l.id === sourceLead.id)) {
          try {
            await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(sourceLead.id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}`, {
              method: 'DELETE',
              headers: supabaseHeaders
            });
          } catch (e) {
            console.warn('Erro ao remover lead antigo do Instagram após merge:', e);
          }
        }

        finalMessage = `Lead "${resultLead.name}" (@${inputInsta || cleanInstagram(resultLead.instagram)}) migrado do Instagram e MESCLADO com a negociação existente no WhatsApp (${inputPhone}) na etapa "${destStage}". Histórico preservado e card do Instagram removido com sucesso.`;

      // CENÁRIO B: NÃO EXISTE NEGOCIAÇÃO NO WHATSAPP COM ESTE TELEFONE -> MIGRAR DIRETO
      } else {
        isMerged = false;

        let consolidatedNotes = sourceLead ? sourceLead.notes || '' : '';
        consolidatedNotes = consolidatedNotes ? `${consolidatedNotes}\n\n${auditLog}` : auditLog;

        const finalName = inputName || sourceLead?.name || (inputInsta ? `@${inputInsta}` : `Cliente (${inputPhone})`);
        const finalValue = (inputValue !== undefined) ? inputValue : (sourceLead?.value || 35000);
        const finalInsta = inputInsta || cleanInstagram(sourceLead?.instagram) || '';
        const finalCity = sourceLead?.city || 'Brasil';
        const finalLine = sourceLead?.commercial_line || 'Linha Premium';

        // Verifica se o lead original já existe no Supabase
        const sourceExistsInDb = sourceLead && dbLeads.some(l => l.id === sourceLead.id);

        if (sourceExistsInDb) {
          destinationLeadId = sourceLead.id;
          const updatePayload = {
            user_id: SELLER_USER_ID,
            name: finalName,
            phone: inputPhone,
            instagram: finalInsta,
            city: finalCity,
            stage: destStage,
            value: finalValue,
            temperature: 'quente',
            commercial_line: finalLine,
            notes: consolidatedNotes,
            followup_date: addDays(1),
            updated_at: new Date().toISOString(),
            last_interaction: new Date().toISOString()
          };

          const patchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(sourceLead.id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}`, {
            method: 'PATCH',
            headers: supabaseHeaders,
            body: JSON.stringify(updatePayload)
          });

          if (patchRes.ok) {
            const patchData = await patchRes.json();
            resultLead = Array.isArray(patchData) ? patchData[0] : patchData;
          }
          if (!resultLead) resultLead = { ...sourceLead, ...updatePayload };

        } else {
          // Cria registro definitivo no Supabase
          const targetId = (sourceLead && sourceLead.id) ? sourceLead.id : `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          destinationLeadId = targetId;

          const insertPayload = {
            id: targetId,
            user_id: SELLER_USER_ID,
            name: finalName,
            phone: inputPhone,
            instagram: finalInsta,
            city: finalCity,
            stage: destStage,
            value: finalValue,
            temperature: 'quente',
            commercial_line: finalLine,
            notes: consolidatedNotes,
            followup_date: addDays(1),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_interaction: new Date().toISOString()
          };

          const insertRes = await fetch(`${supabaseUrl}/rest/v1/leads`, {
            method: 'POST',
            headers: supabaseHeaders,
            body: JSON.stringify(insertPayload)
          });

          if (insertRes.ok) {
            const insertData = await insertRes.json();
            resultLead = Array.isArray(insertData) ? insertData[0] : insertData;
          }
          if (!resultLead) resultLead = insertPayload;
        }

        finalMessage = `Lead "${finalName}" migrado com sucesso do funil "Leads Instagram" para "Negociações WhatsApp" na etapa "${destStage}" com o telefone ${inputPhone}!`;
      }

      return res.status(200).json({
        success: true,
        action: 'moveInstagramLeadToWhatsApp',
        sourceLeadId: sourceLeadId,
        destinationLeadId: destinationLeadId,
        merged: isMerged,
        stage: destStage,
        phone: inputPhone,
        seller: SELLER_NAME,
        origin: 'Instagram',
        message: finalMessage,
        lead: resultLead
      });
    }

    // =========================================================================
    // AÇÃO 3: REATIVAR LEAD DA BASE DE RESGATE / QUARENTENA (reactivateQuarantineLead)
    // =========================================================================
    const isReactivateQuarantine = action === 'reactivatequarantinelead' || action === 'reativar_resgate' || action === 'reactivate' || action === 'reativar';
    if (isReactivateQuarantine) {
      const targetId = body.id || query.id || body.leadId || query.leadId;
      const targetStage = (body.stage || body.destinationStage || query.stage || 'novos').toLowerCase().trim();
      const validDestStages = ['novos', 'investigacao', 'projetos', 'proposta', 'fechamento', 'concluidas'];
      const finalStage = validDestStages.includes(targetStage) ? targetStage : 'novos';

      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR');
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const auditLog = `[${dateStr}, ${timeStr} - Reativação (Admin ${SELLER_NAME})]: Lead reativado com sucesso da Base de Resgate e transferido para Negociações WhatsApp na etapa "${finalStage}".`;

      let reactivatedLead = null;
      if (targetId) {
        try {
          const searchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(targetId)}`, { headers: supabaseHeaders });
          if (searchRes.ok) {
            const found = await searchRes.json();
            if (Array.isArray(found) && found.length > 0) {
              const existing = found[0];
              const newNotes = existing.notes ? `${existing.notes}\n\n${auditLog}` : auditLog;
              const updatePayload = {
                user_id: SELLER_USER_ID,
                stage: finalStage,
                commercial_line: body.commercial_line || existing.commercial_line || 'Linha Premium',
                notes: newNotes,
                followup_date: addDays(1),
                updated_at: new Date().toISOString(),
                last_interaction: new Date().toISOString()
              };
              const patchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(targetId)}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify(updatePayload)
              });
              if (patchRes.ok) {
                const patchData = await patchRes.json();
                reactivatedLead = Array.isArray(patchData) ? patchData[0] : patchData;
              }
              if (!reactivatedLead) reactivatedLead = { ...existing, ...updatePayload };
            }
          }
        } catch (e) {
          console.warn('Erro ao atualizar no Supabase na reativação:', e);
        }
      }

      // Se for um dos leads padrão em memória, cria no Supabase como lead ativo
      if (!reactivatedLead && targetId) {
        const defaultMatch = (DEFAULT_QUARANTINE_LEADS || []).find(q => q.id === targetId);
        if (defaultMatch) {
          const insertPayload = {
            id: targetId,
            user_id: SELLER_USER_ID,
            name: defaultMatch.name,
            phone: defaultMatch.phone,
            instagram: defaultMatch.instagram || '',
            city: defaultMatch.city || 'Brasil',
            stage: finalStage,
            value: defaultMatch.value || 0,
            temperature: 'quente',
            commercial_line: 'Linha Premium',
            notes: `${defaultMatch.notes}\n\n${auditLog}`,
            followup_date: addDays(1),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_interaction: new Date().toISOString()
          };
          try {
            const insertRes = await fetch(`${supabaseUrl}/rest/v1/leads`, {
              method: 'POST',
              headers: supabaseHeaders,
              body: JSON.stringify(insertPayload)
            });
            if (insertRes.ok) {
              const insertData = await insertRes.json();
              reactivatedLead = Array.isArray(insertData) ? insertData[0] : insertData;
            }
          } catch (e) {
            console.warn('Erro ao inserir lead de quarentena reativado no Supabase:', e);
          }
          if (!reactivatedLead) reactivatedLead = insertPayload;
        }
      }

      return res.status(200).json({
        success: true,
        action: 'reactivateQuarantineLead',
        leadId: targetId,
        seller: SELLER_NAME,
        destinationPipeline: 'Negociações WhatsApp',
        destinationStage: finalStage,
        message: `Lead "${reactivatedLead?.name || targetId}" reativado com sucesso para Negociações WhatsApp!`,
        lead: reactivatedLead
      });
    }

    // =========================================================================
    // AÇÃO: CONSULTAR / CONTAR LEADS (GET ou POST action='list'/'count'/'consultar'/'buscar')
    // =========================================================================
    const isListOrCount = req.method === 'GET' ||
      action === 'list' || action === 'count' || action === 'summary' || action === 'relatorio' || action === 'consultar' || action === 'consulta' || action === 'buscar' || action === 'search' ||
      (!body.name && !body.phone && !body.instagram && !body.id && !body.notes && req.method === 'POST');

    if (isListOrCount) {
      const fetchUrl = `${supabaseUrl}/rest/v1/leads?user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*&order=value.desc`;
      const leadsRes = await fetch(fetchUrl, { headers: supabaseHeaders });

      if (!leadsRes.ok) {
        const errText = await leadsRes.text();
        return res.status(500).json({ success: false, error: 'Erro ao consultar leads no Supabase', details: errText });
      }

      const dbLeads = (await leadsRes.json()) || [];

      // Mescla com os leads oficiais de Instagram caso ainda não estejam gravados no Supabase
      const existingIds = new Set(dbLeads.map(l => l.id));
      const existingInstas = new Set(dbLeads.map(l => (l.instagram || '').toLowerCase().replace(/^@/, '')));

      const mergedLeads = [...dbLeads];
      DEFAULT_INSTAGRAM_LEADS_GABRIEL.forEach(instaLead => {
        const cleanInsta = (instaLead.instagram || '').toLowerCase().replace(/^@/, '');
        if (!existingIds.has(instaLead.id) && !existingInstas.has(cleanInsta)) {
          mergedLeads.push(instaLead);
        }
      });

      const requestedChannel = (query.channel || body.channel || query.pipeline || body.pipeline || '').toLowerCase().trim();
      const isInstagramQuery = requestedChannel === 'instagram' ||
        (query.stage && ['novo', 'abordagem', 'conversa'].includes(query.stage.toLowerCase())) ||
        (body.stage && ['novo', 'abordagem', 'conversa'].includes(body.stage.toLowerCase())) ||
        (query.search && query.search.toLowerCase().includes('instagram')) ||
        (body.search && body.search.toLowerCase().includes('instagram'));

      let totalPipelineValue = 0;
      const stagesSummary = { novos: 0, investigacao: 0, projetos: 0, proposta: 0, fechamento: 0, concluidas: 0 };
      const stagesInstagramSummary = { novo: 0, abordagem: 0, conversa: 0 };
      const temperaturesSummary = { quente: 0, morno: 0, frio: 0 };

      mergedLeads.forEach(l => {
        const v = Number(l.value) || 0;
        totalPipelineValue += v;
        const st = (l.stage || 'novos').toLowerCase();
        if (stagesSummary[st] !== undefined) stagesSummary[st] += 1;
        if (stagesInstagramSummary[st] !== undefined) stagesInstagramSummary[st] += 1;
        const tp = (l.temperature || 'morno').toLowerCase();
        temperaturesSummary[tp] = (temperaturesSummary[tp] || 0) + 1;
      });

      let stageFilter = (query.stage || body.stage || '').toLowerCase().trim();
      let searchFilter = (query.search || query.q || query.name || query.cliente || body.search || body.q || body.name || body.cliente || '').toLowerCase().trim();
      let tempFilter = (query.temperature || body.temperature || '').toLowerCase().trim();

      const genericTerms = ['cliente', 'clientes', 'lead', 'leads', 'todos', 'tudo', 'all', 'cadastrado', 'cadastrados', 'geral', 'total', 'gabriel', 'gabriel lima'];
      if (genericTerms.includes(searchFilter)) searchFilter = '';
      if (genericTerms.includes(stageFilter)) stageFilter = '';

      let filteredLeads = mergedLeads;

      const isQuarantineQuery = requestedChannel === 'quarentena' ||
        requestedChannel === 'resgate' ||
        (query.pipeline && (query.pipeline.toLowerCase() === 'quarentena' || query.pipeline.toLowerCase() === 'resgate')) ||
        (body.pipeline && (body.pipeline.toLowerCase() === 'quarentena' || body.pipeline.toLowerCase() === 'resgate'));

      const isCountOnly = action === 'count' || action === 'contar' || action === 'total' || query.count === 'true';

      const compactLead = (l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        instagram: l.instagram,
        city: l.city,
        stage: l.stage,
        stage_label: l.stage_label || l.stage,
        value: l.value,
        temperature: l.temperature,
        priority: l.priority,
        commercial_line: l.commercial_line,
        followup_status: l.followup_status || 'Ativo',
        followup_date: l.followup_date,
        channel: l.channel || (l.instagram && !l.phone ? 'instagram' : 'whatsapp'),
        notes: l.notes ? (l.notes.length > 200 ? l.notes.substring(0, 200) + '...' : l.notes) : ''
      });

      if (isQuarantineQuery) {
        const quarTotal = (DEFAULT_QUARANTINE_LEADS || []).reduce((acc, l) => acc + (Number(l.value) || 0), 0);
        return res.status(200).json({
          success: true,
          seller: SELLER_NAME,
          funnel: 'Base de Resgate (Quarentena Ex-Vendedor)',
          total_leads: DEFAULT_QUARANTINE_LEADS.length,
          pipeline_total_value: quarTotal,
          pipeline_total_value_formatted: formatBRL(quarTotal),
          message: `${SELLER_NAME} possui ${DEFAULT_QUARANTINE_LEADS.length} leads na Base de Resgate (Quarentena). Pipeline: ${formatBRL(quarTotal)}.`,
          leads: isCountOnly ? [] : (DEFAULT_QUARANTINE_LEADS || []).slice(0, 10).map(compactLead)
        });
      }

      if (isInstagramQuery) {
        filteredLeads = filteredLeads.filter(l =>
          l.channel === 'instagram' ||
          l.pipeline === 'instagram' ||
          ['novo', 'abordagem', 'conversa'].includes((l.stage || '').toLowerCase()) ||
          Boolean(l.instagram && !l.phone) ||
          String(l.notes || '').toLowerCase().includes('direct')
        );
      } else if (stageFilter) {
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

      const isFiltered = Boolean(stageFilter || searchFilter || tempFilter || isInstagramQuery);
      const leadsToDisplay = isFiltered ? filteredLeads : mergedLeads;
      const defaultLimit = (stageFilter || searchFilter) ? 15 : 10;
      const limit = Math.min(parseInt(query.limit || body.limit, 10) || defaultLimit, 30);

      const formattedStages = Object.entries(stagesSummary).map(([s, c]) => `${s}: ${c}`).join(', ');
      const formattedPipeline = formatBRL(totalPipelineValue);

      let message = '';
      if (isInstagramQuery) {
        const instaTotal = filteredLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0);
        message = `${SELLER_NAME} possui ${filteredLeads.length} leads no funil de Instagram Direct com pipeline de ${formatBRL(instaTotal)}. ` +
          filteredLeads.slice(0, 5).map((l, i) => `${i + 1}. ${l.name} (@${l.instagram || 'direct'}, ${formatBRL(l.value)}, Etapa: ${l.stage_label || l.stage}, Follow-up: ${l.followup_status || 'Ativo'})`).join('; ');
      } else if (isFiltered && filteredLeads.length === 0) {
        message = `Nenhum cliente encontrado no funil de ${SELLER_NAME} para a busca "${searchFilter || stageFilter || tempFilter}".`;
      } else {
        message = `${SELLER_NAME} possui atualmente ${mergedLeads.length} clientes cadastrados no CRM com pipeline total de ${formattedPipeline}. Funil: [${formattedStages}].`;
      }

      const leadsResponseList = isCountOnly ? [] : leadsToDisplay.slice(0, limit).map(compactLead);

      const responseObj = {
        success: true,
        seller: SELLER_NAME,
        total_leads: mergedLeads.length,
        total_clients: mergedLeads.length,
        total_clientes: mergedLeads.length,
        pipeline_total_value: totalPipelineValue,
        pipeline_total_value_formatted: formattedPipeline,
        stages_summary: stagesSummary,
        stages_instagram_summary: stagesInstagramSummary,
        temperatures_summary: temperaturesSummary,
        message: message,
        leads_returned: leadsResponseList.length
      };

      if (!isCountOnly) {
        responseObj.leads = leadsResponseList;
      }

      return res.status(200).json(responseObj);
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

    const isInstagram = (channel === 'instagram') ||
      (pipeline === 'instagram') ||
      (origin === 'instagram') ||
      Boolean(normalizedInsta) ||
      (String(id || '').toLowerCase().startsWith('insta-')) ||
      (String(notes || '').toLowerCase().includes('instagram')) ||
      (String(notes || '').toLowerCase().includes('direct'));

    let targetStage = stage || stage_instagram || (isInstagram ? 'novos' : 'novos');
    const stageLower = String(targetStage).toLowerCase().trim();
    if (stageLower === 'novo') targetStage = 'novos';
    else if (stageLower === 'abordagem') targetStage = 'investigacao';
    else if (stageLower === 'conversa') targetStage = 'projetos';

    let existingLead = null;
    if (id) {
      const searchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*`, { headers: supabaseHeaders });
      if (searchRes.ok) {
        const found = await searchRes.json();
        if (Array.isArray(found) && found.length > 0) existingLead = found[0];
      }
    }
    if (!existingLead && normalizedPhone) {
      const searchRes = await fetch(`${supabaseUrl}/rest/v1/leads?phone=eq.${encodeURIComponent(normalizedPhone)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*`, { headers: supabaseHeaders });
      if (searchRes.ok) {
        const found = await searchRes.json();
        if (Array.isArray(found) && found.length > 0) existingLead = found[0];
      }
    }
    if (!existingLead && normalizedInsta) {
      const searchRes = await fetch(`${supabaseUrl}/rest/v1/leads?instagram=ilike.%25${encodeURIComponent(normalizedInsta)}%25&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*`, { headers: supabaseHeaders });
      if (searchRes.ok) {
        const found = await searchRes.json();
        if (Array.isArray(found) && found.length > 0) existingLead = found[0];
      }
    }
    if (!existingLead && name && String(name).trim().length >= 3) {
      const searchRes = await fetch(`${supabaseUrl}/rest/v1/leads?name=ilike.%${encodeURIComponent(String(name).trim())}%&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*&limit=1`, { headers: supabaseHeaders });
      if (searchRes.ok) {
        const found = await searchRes.json();
        if (Array.isArray(found) && found.length > 0) existingLead = found[0];
      }
    }

    // EXCLUIR
    if (action === 'delete' || action === 'excluir') {
      if (!existingLead) {
        return res.status(404).json({ success: false, error: `Lead "${name || phone || id}" não foi encontrado na carteira de ${SELLER_NAME}.` });
      }
      const delRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(existingLead.id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}`, {
        method: 'DELETE',
        headers: supabaseHeaders
      });
      if (!delRes.ok) {
        const errText = await delRes.text();
        return res.status(500).json({ success: false, error: 'Erro ao excluir no Supabase', details: errText });
      }
      return res.status(200).json({
        success: true,
        action: 'delete',
        message: `Lead "${existingLead.name}" excluído com sucesso do funil de ${SELLER_NAME}!`,
        deleted_lead: existingLead
      });
    }

    // UPSERT / REORGANIZE
    if (!name && !normalizedPhone && !normalizedInsta && !id && !existingLead) {
      return res.status(400).json({ success: false, error: 'Forneça Nome, Telefone ou Instagram.' });
    }

    let consolidatedNotes = existingLead ? existingLead.notes || '' : '';
    if (notes && String(notes).trim()) {
      const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const channelPrefix = isInstagram ? '[Canal: Instagram] ' : '';
      const cleanNoteText = String(notes).trim();
      const finalNoteText = (isInstagram && !cleanNoteText.toLowerCase().includes('instagram'))
        ? `${channelPrefix}${cleanNoteText}`
        : cleanNoteText;
      const newEntry = `[${timestamp} - IA ChatGPT (${SELLER_NAME})]: ${finalNoteText}`;
      consolidatedNotes = consolidatedNotes ? `${consolidatedNotes}\n\n${newEntry}` : newEntry;
    } else if (isInstagram && !consolidatedNotes.toLowerCase().includes('instagram')) {
      const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const newEntry = `[${timestamp} - IA ChatGPT (${SELLER_NAME})]: [Canal: Instagram] Lead captado via Instagram Direct / Anúncio.`;
      consolidatedNotes = consolidatedNotes ? `${consolidatedNotes}\n\n${newEntry}` : newEntry;
    }

    const payload = {
      user_id: SELLER_USER_ID,
      updated_at: new Date().toISOString(),
      last_interaction: new Date().toISOString(),
      notes: consolidatedNotes
    };

    if (name) payload.name = name;
    if (normalizedPhone) payload.phone = normalizedPhone;
    if (normalizedInsta) payload.instagram = normalizedInsta;
    if (email) payload.email = email;
    if (city) payload.city = city;

    // Normalização segura de stage (PostgreSQL CHECK CONSTRAINT)
    const validStages = ['novos', 'investigacao', 'projetos', 'proposta', 'fechamento', 'concluidas'];
    payload.stage = validStages.includes(targetStage) ? targetStage : 'novos';

    if (value !== undefined && value !== null && !isNaN(Number(value))) payload.value = Number(value);

    // Normalização segura de temperature
    let targetTemp = String(temperature || 'morno').toLowerCase().trim();
    if (targetTemp === 'alta' || targetTemp === 'hot') targetTemp = 'quente';
    else if (targetTemp === 'baixa' || targetTemp === 'cold') targetTemp = 'frio';
    else if (!['frio', 'morno', 'quente'].includes(targetTemp)) targetTemp = 'morno';
    payload.temperature = targetTemp;

    // Normalização segura de commercial_moment
    if (commercial_moment) {
      const momentLower = String(commercial_moment).toLowerCase().trim();
      payload.commercial_moment = ['pesquisa', 'comparacao', 'decisao', 'fechamento'].includes(momentLower) ? momentLower : 'pesquisa';
    } else if (isInstagram) {
      payload.commercial_moment = 'pesquisa';
    }

    if (predominant_emotion) payload.predominant_emotion = predominant_emotion;
    if (behavioral_profile) payload.behavioral_profile = behavioral_profile;
    if (buying_signals) payload.buying_signals = buying_signals;
    if (main_objection) payload.main_objection = main_objection;
    if (gabriel_percentage !== undefined && !isNaN(Number(gabriel_percentage))) payload.gabriel_percentage = Number(gabriel_percentage);
    if (jhennifer_percentage !== undefined && !isNaN(Number(jhennifer_percentage))) payload.jhennifer_percentage = Number(jhennifer_percentage);
    if (strategic_reading) payload.strategic_reading = strategic_reading;
    if (next_best_action) payload.next_best_action = next_best_action;
    if (desired_micro_advance) payload.desired_micro_advance = desired_micro_advance;
    if (what_not_to_do) payload.what_not_to_do = what_not_to_do;

    // Normalização segura de advance_probability
    if (advance_probability) {
      const advLower = String(advance_probability).toLowerCase().trim();
      if (['baixa', 'media', 'alta'].includes(advLower)) payload.advance_probability = advLower;
    }

    // Normalização segura de priority
    if (priority) {
      const prioUpper = String(priority).toUpperCase().trim();
      if (['BAIXA', 'MEDIA', 'ALTA', 'MAXIMA'].includes(prioUpper)) payload.priority = prioUpper;
    }

    if (category || commercial_line) payload.commercial_line = category || commercial_line;

    // Aplica a Inteligência de Cadência de Follow-up Piff-Paff
    const cadence = computeFollowupCadence({
      notes: consolidatedNotes,
      main_objection: payload.main_objection || existingLead?.main_objection,
      commercial_moment: payload.commercial_moment || existingLead?.commercial_moment,
      next_best_action: payload.next_best_action || existingLead?.next_best_action,
      customDate: followup_date,
      isNewLead: !existingLead
    });

    // Se o lead acabou de entrar e a data for hoje/passada (já que falou hoje), entra para o dia seguinte (+1 dia)
    const todayStr = formatYMD(new Date());
    let targetFollowupDate = followup_date || cadence.followup_date;
    if (!existingLead && targetFollowupDate <= todayStr) {
      targetFollowupDate = addDays(1);
    }
    payload.followup_date = targetFollowupDate;
    // NOTA: NÃO enviar followup_status para o Supabase (coluna não existe na tabela leads)

    let resultData = null;
    if (existingLead) {
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(existingLead.id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}`, {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify(payload)
      });
      if (!updateRes.ok) {
        const errText = await updateRes.text();
        console.error('Erro ao atualizar no Supabase:', errText);
        return res.status(500).json({ success: false, error: 'Erro ao atualizar no Supabase', details: errText });
      }
      const updated = await updateRes.json();
      resultData = Array.isArray(updated) ? updated[0] : updated;
    } else {
      payload.id = id || (isInstagram ? `insta-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` : `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
      payload.name = payload.name || (normalizedPhone ? `Cliente (${normalizedPhone})` : (normalizedInsta ? `@${normalizedInsta}` : 'Novo Lead Instagram'));
      payload.stage = payload.stage || targetStage || 'novos';
      payload.temperature = payload.temperature || 'morno';
      payload.commercial_line = payload.commercial_line || 'Linha Premium';
      payload.created_at = new Date().toISOString();

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(payload)
      });
      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.error('Erro insert Supabase Gabriel:', errText);
        return res.status(500).json({ success: false, error: 'Erro ao cadastrar lead no Supabase', details: errText });
      }
      const inserted = await insertRes.json();
      resultData = Array.isArray(inserted) ? inserted[0] : inserted;
      if (!resultData) resultData = payload;
    }

    const actionText = existingLead ? (stage ? 'reorganizado' : 'atualizado') : 'inserido';
    const followupMsg = `Follow-up: ${payload.followup_date} (${cadence.followup_status}). ${cadence.reason}`;

    return res.status(200).json({
      success: true,
      action: existingLead ? (stage ? 'reorganize' : 'update') : 'create',
      channel: isInstagram ? 'instagram' : 'whatsapp',
      funnel: isInstagram ? 'Leads Instagram (Prospecção)' : 'Negociações WhatsApp (Fechamento)',
      followup_date: payload.followup_date,
      followup_status: cadence.followup_status,
      followup_reason: cadence.reason,
      message: `Lead "${resultData?.name}" ${actionText} com sucesso no funil ${isInstagram ? 'Leads Instagram' : 'Negociações WhatsApp'} de ${SELLER_NAME}! ${followupMsg}`,
      seller: SELLER_NAME,
      lead: { ...resultData, followup_status: cadence.followup_status }
    });
  } catch (err) {
    console.error('Erro interno /api/gabriel:', err);
    return res.status(500).json({ success: false, error: err.message || 'Erro interno.' });
  }
}
