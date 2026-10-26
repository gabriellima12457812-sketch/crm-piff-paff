-- ==============================================================================
-- CARIBE / PIFF-PAFF PRO CRM — CRIAÇÃO DOS USUÁRIOS (GABRIEL LIMA & MAYARA)
-- E ATIVAÇÃO DO RLS COM VINCULAÇÃO DOS 170+ LEADS
-- ==============================================================================
-- INSTRUÇÃO:
-- 1. Abra o painel do Supabase (https://supabase.com/dashboard)
-- 2. No menu lateral esquerdo, clique em "SQL Editor"
-- 3. Clique em "+ New query", cole todo este código e clique em "RUN"
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. CRIAÇÃO DO USUÁRIO DO GABRIEL LIMA (VENDEDOR PRINCIPAL)
-- UUID fixo e limpo: a1111111-1111-1111-1111-111111111111
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'authenticated',
    'authenticated',
    'gabriel@piffpaff.com.br',
    crypt('Gabriel@2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Gabriel Lima","role":"vendedor_principal"}'::jsonb,
    now(),
    now(),
    '',
    ''
)
ON CONFLICT (id) DO UPDATE 
SET 
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = now(),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = now();

-- Cria a identidade em auth.identities para o Gabriel
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '{"sub":"a1111111-1111-1111-1111-111111111111","email":"gabriel@piffpaff.com.br"}'::jsonb,
    'email',
    now(),
    now(),
    now()
)
ON CONFLICT (provider, id) DO NOTHING;


-- 2. CRIAÇÃO DA USUÁRIA MAYARA (VENDEDORA)
-- UUID fixo e limpo: b2222222-2222-2222-2222-222222222222
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    'authenticated',
    'authenticated',
    'mayara@piffpaff.com.br',
    crypt('Mayara@2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Mayara","role":"vendedora"}'::jsonb,
    now(),
    now(),
    '',
    ''
)
ON CONFLICT (id) DO UPDATE 
SET 
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = now(),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = now();

-- Cria a identidade em auth.identities para a Mayara
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '{"sub":"b2222222-2222-2222-2222-222222222222","email":"mayara@piffpaff.com.br"}'::jsonb,
    'email',
    now(),
    now(),
    now()
)
ON CONFLICT (provider, id) DO NOTHING;


-- 3. VINCULAÇÃO DE TODOS OS LEADS EXISTENTES (SEM USER_ID) AO GABRIEL LIMA
UPDATE public.leads
SET user_id = 'a1111111-1111-1111-1111-111111111111'::uuid
WHERE user_id IS NULL;


-- 4. ATIVAÇÃO DO ROW LEVEL SECURITY (RLS) E POLÍTICAS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leads view own" ON public.leads;
DROP POLICY IF EXISTS "Leads insert own" ON public.leads;
DROP POLICY IF EXISTS "Leads update own" ON public.leads;
DROP POLICY IF EXISTS "Leads delete own" ON public.leads;
DROP POLICY IF EXISTS "Permitir Leitura Publica" ON public.leads;
DROP POLICY IF EXISTS "Permitir Insercao via API" ON public.leads;
DROP POLICY IF EXISTS "Permitir Atualizacao via API" ON public.leads;
DROP POLICY IF EXISTS "Permitir Exclusao via API" ON public.leads;

-- Vendedor só lê seus próprios leads
CREATE POLICY "Leads view own" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Vendedor só insere leads vinculados a si
CREATE POLICY "Leads insert own" 
ON public.leads 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Vendedor só atualiza seus próprios leads
CREATE POLICY "Leads update own" 
ON public.leads 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Vendedor só deleta seus próprios leads
CREATE POLICY "Leads delete own" 
ON public.leads 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);


-- 5. RELATÓRIO FINAL DE CONFIRMAÇÃO (RETORNA NA TELA DO SUPABASE APÓS O RUN)
SELECT 
    u.raw_user_meta_data->>'name' AS nome_vendedor,
    u.email AS login_email,
    CASE 
        WHEN u.email = 'gabriel@piffpaff.com.br' THEN 'Gabriel@2026'
        WHEN u.email = 'mayara@piffpaff.com.br' THEN 'Mayara@2026'
        ELSE 'Definida no cadastro'
    END AS senha_acesso,
    u.id AS uuid_bearer_token_chatgpt,
    COUNT(l.id) AS total_clientes_vinculados,
    COALESCE(SUM(l.value), 0) AS valor_total_pipeline
FROM auth.users u
LEFT JOIN public.leads l ON l.user_id = u.id
WHERE u.email IN ('gabriel@piffpaff.com.br', 'mayara@piffpaff.com.br')
GROUP BY u.id, u.email, u.raw_user_meta_data
ORDER BY nome_vendedor;
