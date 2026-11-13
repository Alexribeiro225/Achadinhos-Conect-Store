-- Permite que usuários autenticados consultem seu próprio registro admin.
-- O acesso continua limitado pela política RLS em admin_users.
GRANT SELECT ON TABLE public.admin_users TO authenticated;
