-- ==============================================================================
-- CRIAÇÃO DA TABELA HISTORICO_INTERACOES E AJUSTES PARA O FLUXO N8N (GABRIEL)
-- ==============================================================================

-- 1. Garante que a tabela leads possui as colunas categoria, etapa_kanban e vendedor_id
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS categoria integer DEFAULT 1;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS etapa_kanban text DEFAULT 'Novos';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS vendedor_id text DEFAULT 'gabriel';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS data_ultima_interacao timestamp with time zone DEFAULT timezone('utc'::text, now());
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS origem text DEFAULT 'WhatsApp API';

-- 2. Cria a tabela historico_interacoes para registrar o resumo do ChatGPT via n8n
CREATE TABLE IF NOT EXISTS public.historico_interacoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id text,
  telefone text NOT NULL,
  nome_cliente text,
  resumo_interacao text NOT NULL,
  intencao text,
  origem text DEFAULT 'WhatsApp API',
  vendedor_id text DEFAULT 'gabriel',
  user_id uuid DEFAULT 'a1111111-1111-1111-1111-111111111111'::uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Índices de performance
CREATE INDEX IF NOT EXISTS idx_hist_interacoes_telefone ON public.historico_interacoes (telefone);
CREATE INDEX IF NOT EXISTS idx_hist_interacoes_lead_id ON public.historico_interacoes (lead_id);
CREATE INDEX IF NOT EXISTS idx_hist_interacoes_vendedor ON public.historico_interacoes (vendedor_id);
CREATE INDEX IF NOT EXISTS idx_hist_interacoes_created_at ON public.historico_interacoes (created_at DESC);

-- 4. Permissões de RLS para acesso seguro
ALTER TABLE public.historico_interacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir Leitura de Historico" ON public.historico_interacoes;
DROP POLICY IF EXISTS "Permitir Insercao de Historico" ON public.historico_interacoes;

CREATE POLICY "Permitir Leitura de Historico" ON public.historico_interacoes FOR SELECT USING (true);
CREATE POLICY "Permitir Insercao de Historico" ON public.historico_interacoes FOR INSERT WITH CHECK (true);

-- 5. Habilita Realtime na tabela historico_interacoes
ALTER PUBLICATION supabase_realtime ADD TABLE public.historico_interacoes;
