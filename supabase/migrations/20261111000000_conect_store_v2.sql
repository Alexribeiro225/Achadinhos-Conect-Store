-- ==============================================================================
-- CONECT STORE OFERTAS 2.0 — MIGRAÇÃO DO BANCO DE DADOS & SEGURANÇA
-- Arquivo: 20261111000000_conect_store_v2.sql
-- ==============================================================================

-- 1. Habilitar extensões necessárias
-- gen_random_uuid() é fornecido pela extensão pgcrypto no PostgreSQL/Supabase.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de administradores autorizados (admin_users)
-- Apenas usuários cadastrados no Supabase Auth e listados aqui têm acesso administrativo
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabela de produtos (products)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    descricao_curta TEXT NOT NULL,
    descricao_completa TEXT NOT NULL,
    categoria TEXT NOT NULL,
    imagens TEXT[] NOT NULL DEFAULT '{}',
    preco_custo NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    preco_venda NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    preco_anterior NUMERIC(10, 2) NULL, -- Preço comprovado anterior se houver desconto real
    margem_estimada NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Margem estimada informada pela Kaiross
    link_checkout_kaiross TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pausado' CHECK (status IN ('ativo', 'pausado')),
    destaque BOOLEAN NOT NULL DEFAULT false,
    secao_destaque TEXT NOT NULL DEFAULT 'geral' CHECK (secao_destaque IN ('achadinhos', 'ofertas', 'populares', 'geral')),
    etiqueta_oferta TEXT NULL,
    especificacoes JSONB NOT NULL DEFAULT '[]'::jsonb,
    beneficios TEXT[] NOT NULL DEFAULT '{}',
    ordem INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Se a tabela legada 'produtos' existir de versões anteriores, garantir compatibilidade ou migração.
-- O bloco abaixo usa SQL dinâmico para evitar falhar quando colunas antigas não existirem.
DO $$
DECLARE
    legacy_has_data_cadastro BOOLEAN;
    legacy_has_updated_at BOOLEAN;
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'produtos'
    ) THEN
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'produtos' AND column_name = 'data_cadastro'
        ) INTO legacy_has_data_cadastro;

        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'produtos' AND column_name = 'updated_at'
        ) INTO legacy_has_updated_at;

        IF legacy_has_data_cadastro AND legacy_has_updated_at THEN
            EXECUTE '
                INSERT INTO public.products (
                    id, nome, slug, descricao_curta, descricao_completa, categoria, imagens,
                    preco_custo, preco_venda, preco_anterior, margem_estimada, link_checkout_kaiross,
                    status, destaque, secao_destaque, etiqueta_oferta, especificacoes, beneficios, ordem, created_at, updated_at
                )
                SELECT
                    p.id,
                    p.nome,
                    p.slug,
                    p.descricao_curta,
                    p.descricao_completa,
                    p.categoria,
                    p.imagens,
                    p.preco_custo,
                    p.preco_venda,
                    p.preco_anterior,
                    p.margem_estimada,
                    p.link_checkout_kaiross,
                    p.status,
                    p.destaque,
                    COALESCE(p.secao_destaque, ''geral''),
                    p.etiqueta_oferta,
                    COALESCE(p.especificacoes, ''[]''::jsonb),
                    COALESCE(p.beneficios, ''{}''),
                    COALESCE(p.ordem, 0),
                    p.data_cadastro,
                    p.updated_at
                FROM public.produtos p
                ON CONFLICT (id) DO NOTHING;';
        ELSIF legacy_has_data_cadastro THEN
            EXECUTE '
                INSERT INTO public.products (
                    id, nome, slug, descricao_curta, descricao_completa, categoria, imagens,
                    preco_custo, preco_venda, preco_anterior, margem_estimada, link_checkout_kaiross,
                    status, destaque, secao_destaque, etiqueta_oferta, especificacoes, beneficios, ordem, created_at, updated_at
                )
                SELECT
                    p.id,
                    p.nome,
                    p.slug,
                    p.descricao_curta,
                    p.descricao_completa,
                    p.categoria,
                    p.imagens,
                    p.preco_custo,
                    p.preco_venda,
                    p.preco_anterior,
                    p.margem_estimada,
                    p.link_checkout_kaiross,
                    p.status,
                    p.destaque,
                    COALESCE(p.secao_destaque, ''geral''),
                    p.etiqueta_oferta,
                    COALESCE(p.especificacoes, ''[]''::jsonb),
                    COALESCE(p.beneficios, ''{}''),
                    COALESCE(p.ordem, 0),
                    p.data_cadastro,
                    NOW()
                FROM public.produtos p
                ON CONFLICT (id) DO NOTHING;';
        ELSE
            EXECUTE '
                INSERT INTO public.products (
                    id, nome, slug, descricao_curta, descricao_completa, categoria, imagens,
                    preco_custo, preco_venda, preco_anterior, margem_estimada, link_checkout_kaiross,
                    status, destaque, secao_destaque, etiqueta_oferta, especificacoes, beneficios, ordem, created_at, updated_at
                )
                SELECT
                    p.id,
                    p.nome,
                    p.slug,
                    p.descricao_curta,
                    p.descricao_completa,
                    p.categoria,
                    p.imagens,
                    p.preco_custo,
                    p.preco_venda,
                    p.preco_anterior,
                    p.margem_estimada,
                    p.link_checkout_kaiross,
                    p.status,
                    p.destaque,
                    COALESCE(p.secao_destaque, ''geral''),
                    p.etiqueta_oferta,
                    COALESCE(p.especificacoes, ''[]''::jsonb),
                    COALESCE(p.beneficios, ''{}''),
                    COALESCE(p.ordem, 0),
                    NOW(),
                    NOW()
                FROM public.produtos p
                ON CONFLICT (id) DO NOTHING;';
        END IF;
    END IF;
END $$;

-- 4. Tabela de eventos de clique (click_events)
-- Registra eventos reais de redirecionamento para o checkout Kaiross sem dados fictícios
CREATE TABLE IF NOT EXISTS public.click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'storefront' CHECK (source IN ('storefront', 'home', 'category', 'banner'))
);

-- 5. Criação de índices para performance e consultas
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON public.products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_ordem ON public.products(ordem ASC);
CREATE INDEX IF NOT EXISTS idx_click_events_product_id ON public.click_events(product_id);
CREATE INDEX IF NOT EXISTS idx_click_events_clicked_at ON public.click_events(clicked_at DESC);

-- 6. Trigger para atualização automática de updated_at em products
CREATE OR REPLACE FUNCTION public.handle_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.handle_products_updated_at();

-- 7. Função auxiliar segura para checar se o usuário atual é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 8. Função RPC pública para registrar clique em produto ativo
CREATE OR REPLACE FUNCTION public.record_click(p_product_id UUID, p_source TEXT DEFAULT 'storefront')
RETURNS void AS $$
DECLARE
    normalized_source TEXT;
BEGIN
    normalized_source := COALESCE(p_source, 'storefront');

    IF normalized_source NOT IN ('storefront', 'home', 'category', 'banner') THEN
        normalized_source := 'storefront';
    END IF;

    -- Só permite registrar clique se o produto existir e estiver ativo
    IF EXISTS (SELECT 1 FROM public.products WHERE id = p_product_id AND status = 'ativo') THEN
        INSERT INTO public.click_events (product_id, clicked_at, source)
        VALUES (p_product_id, NOW(), normalized_source);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. CONFIGURAÇÃO DE ROW LEVEL SECURITY (RLS)

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

-- O grant permite a consulta via API; a política RLS abaixo limita o resultado ao próprio usuário.
GRANT SELECT ON TABLE public.admin_users TO authenticated;

-- Privilégios SQL necessários para as operações da loja; as políticas RLS abaixo continuam filtrando as linhas.
GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.products TO authenticated;
GRANT SELECT, INSERT ON TABLE public.click_events TO authenticated;
GRANT INSERT ON TABLE public.click_events TO anon;

-- 9.1 Políticas para admin_users:
-- Somente o próprio usuário autenticado pode consultar se é admin
DROP POLICY IF EXISTS "Usuário pode consultar seu próprio status admin" ON public.admin_users;
CREATE POLICY "Usuário pode consultar seu próprio status admin"
ON public.admin_users FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Ninguém pode inserir/modificar admin_users via API pública (deve ser inserido pelo proprietário no SQL ou Service Role)
-- Nenhuma política de INSERT/UPDATE pública para evitar auto-promoção

-- 9.2 Políticas para products:
-- Visitantes podem consultar apenas produtos ativos; administradores podem consultar todos os produtos
DROP POLICY IF EXISTS "Visitantes podem consultar produtos ativos ou admin todos" ON public.products;
CREATE POLICY "Visitantes podem consultar produtos ativos ou admin todos"
ON public.products FOR SELECT
USING (status = 'ativo' OR public.is_admin());

-- Somente administradores autenticados podem cadastrar produtos
DROP POLICY IF EXISTS "Apenas admin pode cadastrar produtos" ON public.products;
CREATE POLICY "Apenas admin pode cadastrar produtos"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Somente administradores autenticados podem alterar produtos
DROP POLICY IF EXISTS "Apenas admin pode atualizar produtos" ON public.products;
CREATE POLICY "Apenas admin pode atualizar produtos"
ON public.products FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Somente administradores autenticados podem excluir produtos
DROP POLICY IF EXISTS "Apenas admin pode excluir produtos" ON public.products;
CREATE POLICY "Apenas admin pode excluir produtos"
ON public.products FOR DELETE
TO authenticated
USING (public.is_admin());

-- 9.3 Políticas para click_events:
-- Qualquer visitante pode registrar clique em produto ativo, desde que a origem seja válida
DROP POLICY IF EXISTS "Qualquer um pode inserir cliques para produtos ativos" ON public.click_events;
CREATE POLICY "Qualquer um pode inserir cliques para produtos ativos"
ON public.click_events FOR INSERT
WITH CHECK (
    source IN ('storefront', 'home', 'category', 'banner')
    AND EXISTS (
        SELECT 1 FROM public.products
        WHERE id = click_events.product_id AND status = 'ativo'
    )
);

-- Somente administradores podem consultar os registros de cliques
DROP POLICY IF EXISTS "Apenas admin pode visualizar cliques" ON public.click_events;
CREATE POLICY "Apenas admin pode visualizar cliques"
ON public.click_events FOR SELECT
TO authenticated
USING (public.is_admin());

-- 10. CRIAÇÃO DO BUCKET DE IMAGENS E POLÍTICAS DE STORAGE
-- Insere o bucket 'product-images' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage para o bucket product-images
DROP POLICY IF EXISTS "Imagens de produtos são públicas para leitura" ON storage.objects;
CREATE POLICY "Imagens de produtos são públicas para leitura"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Apenas admins podem fazer upload de imagens" ON storage.objects;
CREATE POLICY "Apenas admins podem fazer upload de imagens"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'product-images' AND public.is_admin()
);

DROP POLICY IF EXISTS "Apenas admins podem atualizar imagens" ON storage.objects;
CREATE POLICY "Apenas admins podem atualizar imagens"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'product-images' AND public.is_admin()
)
WITH CHECK (
    bucket_id = 'product-images' AND public.is_admin()
);

DROP POLICY IF EXISTS "Apenas admins podem excluir imagens" ON storage.objects;
CREATE POLICY "Apenas admins podem excluir imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'product-images' AND public.is_admin()
);

-- ==============================================================================
-- INSTRUÇÃO PARA CADASTRAR O PRIMEIRO ADMINISTRADOR:
-- 1. Crie o usuário no Supabase Auth (Dashboard > Authentication > Users > Add user)
-- 2. Copie o UUID do usuário criado (ex: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
-- 3. Execute o comando SQL abaixo no SQL Editor do Supabase:
--
--    INSERT INTO public.admin_users (user_id) 
--    VALUES ('COLE_AQUI_O_UUID_DO_USUARIO_CRIADO')
--    ON CONFLICT (user_id) DO NOTHING;
-- ==============================================================================
