-- ==============================================================================
-- LIBERAÇÃO DEFINITIVA DO PERFIL EDSON (DONO DA EMPRESA / DIRETORIA)
-- MODO EXECUTIVO • 100% SOMENTE LEITURA (READ-ONLY)
-- ==============================================================================
-- 1. Abra o Supabase SQL Editor: https://supabase.com/dashboard/project/ukuaujxvdziiaxxuuidw/sql/new
-- 2. Cole este código e clique em RUN (ou aperte Ctrl + Enter)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. PERMISSÃO DE LEITURA TOTAL PARA O DONO EDSON (AUDITORIA DE TODA A EMPRESA)
DROP POLICY IF EXISTS "Permitir Edson Select Total" ON public.leads;
CREATE POLICY "Permitir Edson Select Total" 
ON public.leads FOR SELECT TO public 
USING (true); -- Edson tem permissão para auditar todos os leads da empresa

-- Edson é estritamente SOMENTE LEITURA: Não possui políticas de INSERT/UPDATE/DELETE próprias

-- 2. CRIAÇÃO DO USUÁRIO EDSON NO SUPABASE AUTH (PARA LOGIN NO CRM)
DELETE FROM auth.identities 
WHERE user_id = '99999999-9999-9999-9999-999999999999'::uuid 
   OR user_id IN (SELECT id FROM auth.users WHERE email = 'edson@piffpaff.com.br');

DELETE FROM auth.users 
WHERE id = '99999999-9999-9999-9999-999999999999'::uuid 
   OR email = 'edson@piffpaff.com.br';

INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '99999999-9999-9999-9999-999999999999'::uuid,
    'authenticated', 'authenticated',
    'edson@piffpaff.com.br',
    crypt('Edson@2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Edson (Dono da Empresa)","role":"owner"}'::jsonb,
    now(), now()
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'identities' AND column_name = 'provider_id') THEN
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES ('99999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999'::uuid, '{"sub":"99999999-9999-9999-9999-999999999999","email":"edson@piffpaff.com.br"}'::jsonb, 'email', '99999999-9999-9999-9999-999999999999', now(), now(), now());
    ELSE
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES ('99999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999'::uuid, '{"sub":"99999999-9999-9999-9999-999999999999","email":"edson@piffpaff.com.br"}'::jsonb, 'email', now(), now(), now());
    END IF;
END $$;
