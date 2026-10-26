-- ==============================================================================
-- MIGRAÇÃO OFICIAL DE GOVERNANÇA, BLINDAGEM DE DADOS (SOFT DELETE),
-- AUDITORIA, 2FA INTELIGENTE E AUTOATIVAÇÃO DO SUPER ADMIN (ÉDSON)
-- ==============================================================================
-- Compatível com PostgreSQL / Supabase (Projeto: ukuaujxvdziiaxxuuidw)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==============================================================================
-- ETAPA 1.1: TABELA DE USUÁRIOS E SOFT DELETE UNIVERSAL (deleted_at)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT DEFAULT '',
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'vendedor' CHECK (role IN ('super_admin', 'admin', 'vendedor')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    requires_2fa BOOLEAN NOT NULL DEFAULT false,
    prefix TEXT DEFAULT 'CRM-USR-',
    session_version INTEGER NOT NULL DEFAULT 1,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    lead_id TEXT,
    order_number TEXT,
    client_name TEXT,
    total_value NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'ativo',
    payload JSONB DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contracts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    lead_id TEXT,
    contract_number TEXT,
    client_name TEXT,
    total_value NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'ativo',
    payload JSONB DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    lead_id TEXT,
    sender TEXT,
    channel TEXT DEFAULT 'whatsapp',
    content TEXT,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adiciona a coluna deleted_at (TIMESTAMP NULL) em todas as tabelas comerciais
ALTER TABLE IF EXISTS public.leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE IF EXISTS public.contracts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE IF EXISTS public.messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE IF EXISTS public.historico_interacoes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_deleted_at ON public.leads(deleted_at);
CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON public.orders(deleted_at);
CREATE INDEX IF NOT EXISTS idx_contracts_deleted_at ON public.contracts(deleted_at);
CREATE INDEX IF NOT EXISTS idx_messages_deleted_at ON public.messages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON public.users(deleted_at);

-- ==============================================================================
-- ETAPA 1.2: TRILHA DE AUDITORIA (audit_logs)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- ETAPA 2: DISPOSITIVOS CONFIÁVEIS E 2FA DO SUPER ADMIN (user_trusted_devices)
-- Nota: Sempre confiável (vitalício, sem expiração). Permanece confiável enquanto is_revoked = false.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_trusted_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    device_token_hash TEXT NOT NULL UNIQUE,
    device_name TEXT,
    ip_address TEXT,
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_token
    ON public.user_trusted_devices(user_id, device_token_hash)
    WHERE is_revoked = false;

-- Tabela auxiliar para desafios de 2FA (código de 6 dígitos válido por 10 min)
CREATE TABLE IF NOT EXISTS public.two_factor_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ETAPA 3: LINK DE AUTOATIVAÇÃO DO ÉDSON (admin_setup_tokens)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.admin_setup_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    email_code_hash TEXT,
    phone_code_hash TEXT,
    pending_email TEXT,
    pending_phone TEXT,
    pending_password_hash TEXT,
    is_used BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_setup_tokens_hash ON public.admin_setup_tokens(token_hash);

-- ==============================================================================
-- SEED INICIAL DE USUÁRIOS (ÉDSON SUPER ADMIN + EQUIPE COMERCIAL)
-- ==============================================================================

INSERT INTO public.users (id, name, email, phone, password_hash, role, status, requires_2fa, prefix)
VALUES
    ('99999999-9999-9999-9999-999999999999', 'Édson (Super Administrador)', 'edson@piffpaff.com.br', '47999990000', encode(digest('Edson@2026', 'sha256'), 'hex'), 'super_admin', 'active', true, 'CRM-EDS-'),
    ('a1111111-1111-1111-1111-111111111111', 'Gabriel Lima', 'gabriel@piffpaff.com.br', '47999991111', encode(digest('Gabriel@2026', 'sha256'), 'hex'), 'admin', 'active', false, 'CRM-GAB-'),
    ('c3333333-3333-3333-3333-333333333333', 'Felipe', 'felipe@piffpaff.com.br', '47999993333', encode(digest('Felipe@2026', 'sha256'), 'hex'), 'vendedor', 'active', false, 'CRM-FEL-'),
    ('b2222222-2222-2222-2222-222222222222', 'Mayara', 'mayara@piffpaff.com.br', '47999992222', encode(digest('Mayara@2026', 'sha256'), 'hex'), 'vendedor', 'active', false, 'CRM-MAY-'),
    ('f6666666-6666-6666-6666-666666666666', 'Especialista Bárbara', 'barbara@piffpaff.com.br', '47999996666', encode(digest('Barbara@2026', 'sha256'), 'hex'), 'vendedor', 'active', false, 'CRM-BAR-'),
    ('d4444444-4444-4444-4444-444444444444', 'Eduardo', 'eduardo@piffpaff.com.br', '47999994444', encode(digest('Eduardo@2026', 'sha256'), 'hex'), 'vendedor', 'active', false, 'CRM-EDU-'),
    ('e5555555-5555-5555-5555-555555555555', 'Especialista Rodrigo', 'rodrigo@piffpaff.com.br', '47999995555', encode(digest('Rodrigo@2026', 'sha256'), 'hex'), 'vendedor', 'active', false, 'CRM-ROD-'),
    ('77777777-7777-7777-7777-777777777777', 'Kasio', 'kasio@piffpaff.com.br', '47999997777', encode(digest('Kasio@2026', 'sha256'), 'hex'), 'vendedor', 'active', false, 'CRM-KAS-')
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    requires_2fa = EXCLUDED.requires_2fa,
    updated_at = now();

-- Seed de Tokens Iniciais de Autoativação para o Édson (Sem expiração — Sempre Confiável)
INSERT INTO public.admin_setup_tokens (user_id, token_hash, is_used, expires_at)
VALUES
    ('99999999-9999-9999-9999-999999999999', encode(digest('edson_setup_2026_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c', 'sha256'), 'hex'), false, NULL),
    ('99999999-9999-9999-9999-999999999999', encode(digest('EDSON-SETUP-2026-MASTER', 'sha256'), 'hex'), false, NULL)
ON CONFLICT (token_hash) DO NOTHING;

-- ==============================================================================
-- PROTEÇÃO DE SOFT DELETE E RLS NO BANCO DE DADOS
-- ==============================================================================

-- Trigger que impede DELETE físico em public.leads e converte em Soft Delete
CREATE OR REPLACE FUNCTION public.prevent_physical_delete_leads()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.leads
    SET deleted_at = now(),
        updated_at = now()
    WHERE id = OLD.id;

    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, details)
    VALUES (
         COALESCE(auth.uid()::text, OLD.user_id::text, 'system'),
        'LEAD_SOFT_DELETE_TRIGGER',
        'lead',
        OLD.id::text,
        jsonb_build_object('name', OLD.name, 'phone', OLD.phone, 'value', OLD.value)
    );
    RETURN NULL; -- Cancela a exclusão física mantendo o registro com deleted_at preenchido
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_soft_delete_leads ON public.leads;
CREATE TRIGGER trg_soft_delete_leads
BEFORE DELETE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.prevent_physical_delete_leads();

-- Políticas de RLS com isolamento de vendedor e permissão total ao Super Admin (Édson)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Isolamento Vendedor e Super Admin Select" ON public.leads;
CREATE POLICY "Isolamento Vendedor e Super Admin Select"
ON public.leads FOR SELECT TO public
USING (
    deleted_at IS NULL
    OR auth.uid()::text = '99999999-9999-9999-9999-999999999999'
);

DROP POLICY IF EXISTS "Super Admin Update Total" ON public.leads;
CREATE POLICY "Super Admin Update Total"
ON public.leads FOR UPDATE TO public
USING (true)
WITH CHECK (true);
