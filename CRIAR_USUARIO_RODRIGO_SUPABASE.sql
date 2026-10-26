-- ==============================================================================
-- LIBERAÇÃO DEFINITIVA DO RODRIGO (CHATGPT + BANCO SUPABASE)
-- ==============================================================================
-- 1. Abra o Supabase SQL Editor: https://supabase.com/dashboard/project/ukuaujxvdziiaxxuuidw/sql/new
-- 2. Cole este código e clique em RUN (ou aperte Ctrl + Enter)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. LIBERAÇÃO DEFINITIVA DE PERMISSÃO (RLS) PARA A CARTEIRA DO RODRIGO
DROP POLICY IF EXISTS "Permitir Rodrigo Select" ON public.leads;
CREATE POLICY "Permitir Rodrigo Select" 
ON public.leads FOR SELECT TO public 
USING (user_id = 'e5555555-5555-5555-5555-555555555555'::uuid);

DROP POLICY IF EXISTS "Permitir Rodrigo Insert" ON public.leads;
CREATE POLICY "Permitir Rodrigo Insert" 
ON public.leads FOR INSERT TO public 
WITH CHECK (user_id = 'e5555555-5555-5555-5555-555555555555'::uuid);

DROP POLICY IF EXISTS "Permitir Rodrigo Update" ON public.leads;
CREATE POLICY "Permitir Rodrigo Update" 
ON public.leads FOR UPDATE TO public 
USING (user_id = 'e5555555-5555-5555-5555-555555555555'::uuid)
WITH CHECK (user_id = 'e5555555-5555-5555-5555-555555555555'::uuid);

DROP POLICY IF EXISTS "Permitir Rodrigo Delete" ON public.leads;
CREATE POLICY "Permitir Rodrigo Delete" 
ON public.leads FOR DELETE TO public 
USING (user_id = 'e5555555-5555-5555-5555-555555555555'::uuid);

-- 2. CRIAÇÃO DO USUÁRIO RODRIGO NO SUPABASE AUTH (PARA LOGIN NO CRM)
DELETE FROM auth.identities 
WHERE user_id = 'e5555555-5555-5555-5555-555555555555'::uuid 
   OR user_id IN (SELECT id FROM auth.users WHERE email = 'rodrigo@piffpaff.com.br');

DELETE FROM auth.users 
WHERE id = 'e5555555-5555-5555-5555-555555555555'::uuid 
   OR email = 'rodrigo@piffpaff.com.br';

INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'e5555555-5555-5555-5555-555555555555'::uuid,
    'authenticated', 'authenticated',
    'rodrigo@piffpaff.com.br',
    crypt('Rodrigo@2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Rodrigo","role":"vendedor"}'::jsonb,
    now(), now()
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'identities' AND column_name = 'provider_id') THEN
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES ('e5555555-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555'::uuid, '{"sub":"e5555555-5555-5555-5555-555555555555","email":"rodrigo@piffpaff.com.br"}'::jsonb, 'email', 'e5555555-5555-5555-5555-555555555555', now(), now(), now());
    ELSE
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES ('e5555555-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555'::uuid, '{"sub":"e5555555-5555-5555-5555-555555555555","email":"rodrigo@piffpaff.com.br"}'::jsonb, 'email', now(), now(), now());
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Aviso identities: %', SQLERRM;
END $$;
