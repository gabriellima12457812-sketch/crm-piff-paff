// Script de Retroalimentação Inteligente de Pipeline e Valores no Supabase CRM
const SUPABASE_URL = 'https://ukuaujxvdziiaxxuuidw.supabase.co';
const SERVICE_KEY = 'sb_publishable_g-9BXuBM-xknIbIlpmF36A_ON6vnkuO';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

function extractMonetaryValue(text) {
  if (!text || typeof text !== 'string') return 0;
  const clean = text.replace(/\s+/g, ' ');

  // 1. Padrão Parcelado: ex "10x de 1.500", "12x de R$ 1.250", "10x 1800"
  const parcelMatch = clean.match(/(\d{1,2})\s*x\s*(?:de\s*)?(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?)/i);
  if (parcelMatch) {
    const qtdParcelas = parseInt(parcelMatch[1], 10);
    const valorParcelaStr = parcelMatch[2].replace(/\./g, '').replace(',', '.');
    const valorParcela = parseFloat(valorParcelaStr);
    if (!isNaN(valorParcela) && qtdParcelas > 1 && qtdParcelas <= 24) {
      const total = qtdParcelas * valorParcela;
      if (total >= 500 && total <= 2000000) return Math.round(total * 100) / 100;
    }
  }

  // 2. Padrão Abreviado mil/k: ex "15 mil", "18,5 mil", "25k"
  const milMatch = clean.match(/(\d+(?:[.,]\d+)?)\s*(?:mil|k)\b/i);
  if (milMatch) {
    const num = parseFloat(milMatch[1].replace(',', '.'));
    if (!isNaN(num) && num > 0) {
      const total = num * 1000;
      if (total >= 500 && total <= 2000000) return Math.round(total * 100) / 100;
    }
  }

  // 3. Padrão Direto em R$: ex "R$ 15.000,00", "R$ 15.000", "R$ 8.900"
  const rsMatch = clean.match(/R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?)/i);
  if (rsMatch) {
    const numStr = rsMatch[1].replace(/\./g, '').replace(',', '.');
    const total = parseFloat(numStr);
    if (!isNaN(total) && total >= 500 && total <= 2000000) return Math.round(total * 100) / 100;
  }

  // 4. Padrão Contextual: ex "valor de 15000", "orçamento 25.000"
  const contextMatch = clean.match(/(?:valor|or[çc]amento|pre[çc]o|total|fecho por|fica em|fica por)\s*(?:de|em)?\s*(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d{4,6})/i);
  if (contextMatch) {
    const numStr = contextMatch[1].replace(/\./g, '').replace(',', '.');
    const total = parseFloat(numStr);
    if (!isNaN(total) && total >= 500 && total <= 2000000) return Math.round(total * 100) / 100;
  }

  return 0;
}

const STAGE_RANKS = {
  novos: 1,
  investigacao: 2,
  projetos: 3,
  proposta: 4,
  fechamento: 5,
  concluidas: 6
};

function inferPipelineStage(text, currentStage = 'novos', detectedValue = 0) {
  const lower = (text || '').toLowerCase();
  let candidate = null;

  if (/pix|sinal|fechar|fechado|fechamos|contrato|comprovante|dados\s*banc[áa]rios|transfer[êe]ncia|endere[çc]o\s*para\s*entrega|cpf\s*(?:para|p\/)?\s*nota|entrada\s*de/i.test(lower)) {
    candidate = {
      stage: 'fechamento',
      etapa_kanban: 'Fechamento',
      temperature: 'quente',
      commercial_moment: 'fechamento',
      priority: 'MAXIMA',
      advance_probability: 'alta',
      desired_micro_advance: 'Envio do comprovante de sinal do Pix / emissão de pedido.',
      next_best_action: 'Formalizar proposta comercial no WhatsApp com link de pagamento e prazo.'
    };
  } else if (
    detectedValue > 0 ||
    /proposta|or[çc]amento|tabela|desconto|condi[çc][õo]es|parcela|parcelamento|\b\d{1,2}x\b|[àa]\s*vista|frete\s*(?:incluso|gr[áa]tis)|pre[çc]o|valor/i.test(lower)
  ) {
    candidate = {
      stage: 'proposta',
      etapa_kanban: 'Proposta',
      temperature: 'quente',
      commercial_moment: 'proposta',
      priority: detectedValue >= 30000 ? 'MAXIMA' : 'ALTA',
      advance_probability: 'alta',
      desired_micro_advance: 'Definição da forma de pagamento e validação do orçamento.',
      next_best_action: 'Apresentar condições comerciais consultivas e conduzir para o fechamento.'
    };
  } else if (/planta|projeto|layout|medidas|arquiteto|decorador|amostra\s*de|corda\s*n[áa]utica|tecido|3d|ambientes|varanda|[áa]rea\s*externa/i.test(lower)) {
    candidate = {
      stage: 'projetos',
      etapa_kanban: 'Projetos',
      temperature: 'quente',
      commercial_moment: 'decisao',
      priority: 'ALTA',
      advance_probability: 'media',
      desired_micro_advance: 'Aprovação das medidas e escolha dos acabamentos.',
      next_best_action: 'Validar projeto e medidas com o cliente/arquiteto.'
    };
  }

  const currentRank = STAGE_RANKS[(currentStage || 'novos').toLowerCase()] || 1;
  if (candidate) {
    const candidateRank = STAGE_RANKS[candidate.stage] || 1;
    if (candidateRank > currentRank) {
      return candidate;
    }
  }
  return null;
}

async function runRetroalimentacao() {
  console.log('--- INICIANDO RETROALIMENTAÇÃO INTELIGENTE DE LEADS NO SUPABASE ---');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=id,name,phone,notes,stage,etapa_kanban,value,temperature&order=updated_at.desc`, { headers });
    if (!res.ok) {
      console.error('Erro ao buscar leads:', await res.text());
      return;
    }
    const leads = await res.json();
    console.log(`Total de leads analisados: ${leads.length}`);

    let updatedCount = 0;
    for (const lead of leads) {
      if (!lead.notes || lead.notes.length < 5) continue;

      const detectedValue = extractMonetaryValue(lead.notes);
      const pipelineInference = inferPipelineStage(lead.notes, lead.stage, detectedValue);

      const updateData = {};
      const curVal = parseFloat(lead.value) || 0;
      if (detectedValue > 0 && (curVal === 0 || detectedValue > curVal)) {
        updateData.value = detectedValue;
      }

      if (pipelineInference) {
        updateData.stage = pipelineInference.stage;
        updateData.etapa_kanban = pipelineInference.etapa_kanban;
        updateData.temperature = pipelineInference.temperature;
        updateData.commercial_moment = pipelineInference.commercial_moment;
        updateData.priority = pipelineInference.priority;
        updateData.advance_probability = pipelineInference.advance_probability;
        updateData.next_best_action = pipelineInference.next_best_action;
        updateData.desired_micro_advance = pipelineInference.desired_micro_advance;
      }

      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString();
        const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${encodeURIComponent(lead.id)}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updateData)
        });

        if (patchRes.ok) {
          updatedCount++;
          console.log(`[ATUALIZADO] ${lead.name} (${lead.phone || 'Sem telefone'}):`);
          if (updateData.stage) console.log(`   -> Estágio: ${lead.stage} => ${updateData.stage} (${updateData.etapa_kanban})`);
          if (updateData.value) console.log(`   -> Valor: R$ ${curVal} => R$ ${updateData.value}`);
        } else {
          console.warn(`[FALHA] ${lead.name}:`, await patchRes.text());
        }
      }
    }

    console.log(`\n--- CONCLUÍDO! Total de leads atualizados: ${updatedCount} ---`);
  } catch (err) {
    console.error('Erro na retroalimentação:', err);
  }
}

runRetroalimentacao();
