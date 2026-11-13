-- Privilégios SQL necessários para as operações da loja.
-- O acesso efetivo continua limitado pelas políticas RLS das tabelas.
GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.products TO authenticated;
GRANT SELECT, INSERT ON TABLE public.click_events TO authenticated;
GRANT INSERT ON TABLE public.click_events TO anon;
