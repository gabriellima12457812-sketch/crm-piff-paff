-- ==============================================================================
-- LIBERAÇÃO DEFINITIVA DO EDUARDO (CHATGPT + BANCO SUPABASE)
-- ==============================================================================
-- 1. Abra o Supabase SQL Editor: https://supabase.com/dashboard/project/ukuaujxvdziiaxxuuidw/sql/new
-- 2. Cole este código e clique em RUN (ou aperte Ctrl + Enter)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. LIBERAÇÃO DEFINITIVA DE PERMISSÃO (RLS) PARA A CARTEIRA DO EDUARDO
DROP POLICY IF EXISTS "Permitir Eduardo Select" ON public.leads;
CREATE POLICY "Permitir Eduardo Select" 
ON public.leads FOR SELECT TO public 
USING (user_id = 'd4444444-4444-4444-4444-444444444444'::uuid);

DROP POLICY IF EXISTS "Permitir Eduardo Insert" ON public.leads;
CREATE POLICY "Permitir Eduardo Insert" 
ON public.leads FOR INSERT TO public 
WITH CHECK (user_id = 'd4444444-4444-4444-4444-444444444444'::uuid);

DROP POLICY IF EXISTS "Permitir Eduardo Update" ON public.leads;
CREATE POLICY "Permitir Eduardo Update" 
ON public.leads FOR UPDATE TO public 
USING (user_id = 'd4444444-4444-4444-4444-444444444444'::uuid)
WITH CHECK (user_id = 'd4444444-4444-4444-4444-444444444444'::uuid);

DROP POLICY IF EXISTS "Permitir Eduardo Delete" ON public.leads;
CREATE POLICY "Permitir Eduardo Delete" 
ON public.leads FOR DELETE TO public 
USING (user_id = 'd4444444-4444-4444-4444-444444444444'::uuid);

-- 2. CRIAÇÃO DO USUÁRIO EDUARDO NO SUPABASE AUTH (PARA LOGIN NO CRM)
DELETE FROM auth.identities 
WHERE user_id = 'd4444444-4444-4444-4444-444444444444'::uuid 
   OR user_id IN (SELECT id FROM auth.users WHERE email = 'eduardo@piffpaff.com.br');

DELETE FROM auth.users 
WHERE id = 'd4444444-4444-4444-4444-444444444444'::uuid 
   OR email = 'eduardo@piffpaff.com.br';

INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'authenticated', 'authenticated',
    'eduardo@piffpaff.com.br',
    crypt('Eduardo@2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Eduardo","role":"vendedor"}'::jsonb,
    now(), now()
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'identities' AND column_name = 'provider_id') THEN
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES ('d4444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444'::uuid, '{"sub":"d4444444-4444-4444-4444-444444444444","email":"eduardo@piffpaff.com.br"}'::jsonb, 'email', 'd4444444-4444-4444-4444-444444444444', now(), now(), now());
    ELSE
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES ('d4444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444'::uuid, '{"sub":"d4444444-4444-4444-4444-444444444444","email":"eduardo@piffpaff.com.br"}'::jsonb, 'email', now(), now(), now());
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Aviso identities: %', SQLERRM;
END $$;
