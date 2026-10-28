-- ==============================================================================
-- MIGRAÇÃO OFICIAL: RASTREAMENTO AUTOMÁTICO DE CHAMADAS, CONTATOS & REMARKETING
-- Compatível com PostgreSQL / Supabase (Projeto: ukuaujxvdziiaxxuuidw)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Tabela de Chamadas Comerciais Automáticas
CREATE TABLE IF NOT EXISTS public.sales_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    lead_id TEXT NULL,
    caller_number VARCHAR(30) NOT NULL,
    recipient_number VARCHAR(30) NOT NULL,
    call_source VARCHAR(20) DEFAULT 'WHATSAPP', -- 'WHATSAPP', 'VOIP', 'BROWSER'
    status VARCHAR(30) NOT NULL,               -- 'ANSWERED', 'NO_ANSWER', 'BUSY', 'FAILED'
    duration_seconds INT DEFAULT 0,            -- Calculado automaticamente pelo backend
    recording_url TEXT NULL,                   -- Gravação caso disponível
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_calls_user_date ON public.sales_calls(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sales_calls_lead ON public.sales_calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_sales_calls_duration ON public.sales_calls(duration_seconds);
CREATE INDEX IF NOT EXISTS idx_sales_calls_status ON public.sales_calls(status);

-- 2. Tabela de Atividades e Ações Comerciais Diárias (Inbound, Calls, Remarketing)
CREATE TABLE IF NOT EXISTS public.sales_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    lead_id TEXT NULL,
    activity_type VARCHAR(50) NOT NULL, -- 'INBOUND_CONTACT', 'CALL', 'REMARKETING'
    metadata JSONB NULL,                -- Detalhes (ex: duração, canal, dados da mensagem)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_user_date ON public.sales_activities(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_activities_lead ON public.sales_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.sales_activities(activity_type);

-- Permissões para anon, authenticated e service_role
GRANT ALL ON TABLE public.sales_calls TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sales_activities TO anon, authenticated, service_role;
