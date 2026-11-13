-- ==============================================================================
-- CONECT STORE OFERTAS 2.0 — MASTER SCHEMA (SUPABASE / POSTGRESQL)
-- ==============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de administradores autorizados (admin_users)
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

-- 4. Tabela de eventos de clique (click_events)
CREATE TABLE IF NOT EXISTS public.click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'storefront'
);

-- 5. Índices de performance
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON public.products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_ordem ON public.products(ordem ASC);
CREATE INDEX IF NOT EXISTS idx_click_events_product_id ON public.click_events(product_id);
CREATE INDEX IF NOT EXISTS idx_click_events_clicked_at ON public.click_events(clicked_at DESC);

-- 6. Trigger para updated_at automático
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
BEGIN
    IF EXISTS (SELECT 1 FROM public.products WHERE id = p_product_id AND status = 'ativo') THEN
        INSERT INTO public.click_events (product_id, clicked_at, source)
        VALUES (p_product_id, NOW(), COALESCE(p_source, 'storefront'));
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

-- 9.1 admin_users
DROP POLICY IF EXISTS "Usuário pode consultar seu próprio status admin" ON public.admin_users;
CREATE POLICY "Usuário pode consultar seu próprio status admin"
ON public.admin_users FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 9.2 products
DROP POLICY IF EXISTS "Visitantes podem consultar produtos ativos ou admin todos" ON public.products;
CREATE POLICY "Visitantes podem consultar produtos ativos ou admin todos"
ON public.products FOR SELECT
USING (status = 'ativo' OR public.is_admin());

DROP POLICY IF EXISTS "Apenas admin pode cadastrar produtos" ON public.products;
CREATE POLICY "Apenas admin pode cadastrar produtos"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Apenas admin pode atualizar produtos" ON public.products;
CREATE POLICY "Apenas admin pode atualizar produtos"
ON public.products FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Apenas admin pode excluir produtos" ON public.products;
CREATE POLICY "Apenas admin pode excluir produtos"
ON public.products FOR DELETE
TO authenticated
USING (public.is_admin());

-- 9.3 click_events
DROP POLICY IF EXISTS "Qualquer um pode inserir cliques para produtos ativos" ON public.click_events;
CREATE POLICY "Qualquer um pode inserir cliques para produtos ativos"
ON public.click_events FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.products
        WHERE id = click_events.product_id AND status = 'ativo'
    )
);

DROP POLICY IF EXISTS "Apenas admin pode visualizar cliques" ON public.click_events;
CREATE POLICY "Apenas admin pode visualizar cliques"
ON public.click_events FOR SELECT
TO authenticated
USING (public.is_admin());

-- 10. BUCKET DE IMAGENS E POLÍTICAS DE STORAGE
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

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
