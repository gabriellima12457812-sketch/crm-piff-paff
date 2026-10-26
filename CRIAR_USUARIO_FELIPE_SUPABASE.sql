-- ==============================================================================
-- LIBERAÇÃO DEFINITIVA DO FELIPE (CHATGPT + BANCO SUPABASE)
-- ==============================================================================
-- 1. Abra o Supabase: https://supabase.com/dashboard/project/hqqzumdscdjleaedguzh/sql/new
-- 2. Cole este código e clique em RUN (ou aperte Ctrl + Enter)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. LIBERAÇÃO DEFINITIVA DE PERMISSÃO (RLS) PARA A CARTEIRA DO FELIPE
-- Isso elimina o erro 42501 imediatamente no ChatGPT
DROP POLICY IF EXISTS "Permitir Felipe Select" ON public.leads;
CREATE POLICY "Permitir Felipe Select" 
ON public.leads FOR SELECT TO public 
USING (user_id = 'c3333333-3333-3333-3333-333333333333'::uuid);

DROP POLICY IF EXISTS "Permitir Felipe Insert" ON public.leads;
CREATE POLICY "Permitir Felipe Insert" 
ON public.leads FOR INSERT TO public 
WITH CHECK (user_id = 'c3333333-3333-3333-3333-333333333333'::uuid);

DROP POLICY IF EXISTS "Permitir Felipe Update" ON public.leads;
CREATE POLICY "Permitir Felipe Update" 
ON public.leads FOR UPDATE TO public 
USING (user_id = 'c3333333-3333-3333-3333-333333333333'::uuid)
WITH CHECK (user_id = 'c3333333-3333-3333-3333-333333333333'::uuid);

DROP POLICY IF EXISTS "Permitir Felipe Delete" ON public.leads;
CREATE POLICY "Permitir Felipe Delete" 
ON public.leads FOR DELETE TO public 
USING (user_id = 'c3333333-3333-3333-3333-333333333333'::uuid);

-- 2. CRIAÇÃO DO USUÁRIO FELIPE NO SUPABASE AUTH (PARA LOGIN NO CRM)
DELETE FROM auth.identities 
WHERE user_id = 'c3333333-3333-3333-3333-333333333333'::uuid 
   OR user_id IN (SELECT id FROM auth.users WHERE email = 'felipe@piffpaff.com.br');

DELETE FROM auth.users 
WHERE id = 'c3333333-3333-3333-3333-333333333333'::uuid 
   OR email = 'felipe@piffpaff.com.br';

INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    'authenticated', 'authenticated',
    'felipe@piffpaff.com.br',
    crypt('Felipe@2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Felipe","role":"vendedor"}'::jsonb,
    now(), now()
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'identities' AND column_name = 'provider_id') THEN
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES ('c3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333'::uuid, '{"sub":"c3333333-3333-3333-3333-333333333333","email":"felipe@piffpaff.com.br"}'::jsonb, 'email', 'c3333333-3333-3333-3333-333333333333', now(), now(), now());
    ELSE
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES ('c3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333'::uuid, '{"sub":"c3333333-3333-3333-3333-333333333333","email":"felipe@piffpaff.com.br"}'::jsonb, 'email', now(), now(), now());
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Aviso identities: %', SQLERRM;
END $$;
