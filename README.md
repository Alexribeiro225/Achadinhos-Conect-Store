# CONECT STORE OFERTAS 2.0 — EVOLUÇÃO TÉCNICA & SUPABASE

> **Slogan:** *"Achou, gostou, aproveitou!"*  
> **Identidade Visual:** Laranja Principal (`#FF681B`), Amarelo Destaque (`#FFD43B`), Preto (`#171717`), Branco (`#FFFFFF`), Cinza Claro (`#F5F5F5`).

---

## 🚀 Visão Geral da Versão 2.0

A **CONECT STORE OFERTAS 2.0** evolui a vitrine comercial para uma arquitetura robusta e segura integrada ao **Supabase (PostgreSQL, Supabase Auth e Supabase Storage)** com **Row Level Security (RLS)** estrito, rastreamento real de cliques em links de afiliados **Kaiross** e eliminação de dados fictícios.

---

## 🛡️ Arquitetura de Segurança & Banco de Dados

### 1. Tabelas no PostgreSQL (`supabase/migrations/20261111000000_conect_store_v2.sql`)

- **`products`**:
  - `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
  - `nome`, `slug` (UNIQUE), `descricao_curta`, `descricao_completa`, `categoria`
  - `imagens` (TEXT[]), `preco_custo`, `preco_venda`, `preco_anterior`, `margem_estimada` (informada pela Kaiross)
  - `link_checkout_kaiross` (link individual de afiliado)
  - `status` (`'ativo'` ou `'pausado'`), `destaque` (BOOLEAN), `secao_destaque` (`'achadinhos'`, `'ofertas'`, `'populares'`, `'geral'`)
  - `etiqueta_oferta`, `especificacoes` (JSONB), `beneficios` (TEXT[])
  - `ordem`, `created_at`, `updated_at` (atualizado via trigger automático)

- **`admin_users`**:
  - `user_id` (UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE)
  - `created_at` (TIMESTAMPTZ)
  - *Garante que somente usuários cadastrados no Supabase Auth e explicitamente promovidos na tabela tenham privilégios administrativos.*

- **`click_events`**:
  - `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
  - `product_id` (UUID REFERENCES products(id) ON DELETE CASCADE)
  - `clicked_at` (TIMESTAMPTZ)
  - `source` (TEXT, default: 'storefront')
  - *Registra eventos reais de cliques nos botões "COMPRAR AGORA". Nenhuma métrica é inventada.*

- **Bucket de Imagens no Storage (`product-images`)**:
  - Leitura pública para todos os visitantes do site.
  - Upload, alteração e exclusão permitidos **exclusivamente para administradores autenticados**.

### 2. Políticas de Row Level Security (RLS)

| Tabela / Bucket | Operação | Permissão | Regra / Condição |
| :--- | :--- | :--- | :--- |
| `products` | SELECT | Pública / Admin | `status = 'ativo' OR is_admin()` |
| `products` | INSERT / UPDATE / DELETE | Restrita | `is_admin()` |
| `admin_users` | SELECT | Autenticado | `user_id = auth.uid()` |
| `admin_users` | INSERT / UPDATE / DELETE | Bloqueada na API | Inserção manual pelo proprietário no SQL |
| `click_events` | INSERT | Pública | Produto deve existir e ter `status = 'ativo'` |
| `click_events` | SELECT | Restrita | `is_admin()` |
| `product-images` | SELECT (Download) | Pública | Qualquer visitante |
| `product-images` | INSERT / UPDATE / DELETE | Restrita | `is_admin()` |

---

## 🔑 Procedimento Seguro para Cadastro do 1º Administrador

Para garantir máxima segurança contra auto-promoção e invasões, a inclusão do primeiro administrador é feita de forma controlada pelo proprietário:

1. Acesse o painel do **Supabase** do seu projeto: `https://supabase.com/dashboard`.
2. Vá em **Authentication > Users** e clique em **Add user > Create user**.
3. Crie o usuário com o seu e-mail e uma senha forte.
4. Copie o **User UID** gerado (ex: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).
5. Acesse o menu **SQL Editor** e execute:
   ```sql
   INSERT INTO public.admin_users (user_id)
   VALUES ('COLE_SEU_USER_UID_AQUI')
   ON CONFLICT (user_id) DO NOTHING;
   ```
6. Pronto! Agora acesse a rota `#/admin` no site e faça login com seu e-mail e senha. O sistema validará suas credenciais e liberará o painel administrativo.

---

## ⚡ Como Executar Localmente

### Opção 1: Executável Autônomo Imediato
Abra o arquivo [`standalone.html`](./standalone.html) em qualquer navegador web. Ele já vem configurado com suporte direto ao cliente Supabase via CDN e persistência reativa.

### Opção 2: Projeto Vite + React + TypeScript
```bash
# 1. Configurar variáveis no .env
cp .env.example .env
# Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# 2. Instalar dependências e rodar
npm install
npm run dev
```

---

## 📦 Regras Comerciais & Auditoria de Dados (Regra 10)

- **Zero Checkout Próprio:** Todo o processamento de compras ocorre exclusivamente no ambiente seguro da **Kaiross**.
- **Registro Pré-Redirecionamento:** O clique é registrado em `click_events` de forma assíncrona antes ou durante a abertura do link em nova aba (`_blank`), sem travar a navegação do comprador.
- **Auditoria de Produtos:** Os produtos demonstrativos iniciais foram marcados com status `'pausado'`. O lojista deve conferir o estoque, fotos, custo do fornecedor, preço de venda e o link individual de checkout na Kaiross antes de ativá-los para o público.
- **Transparência de Margem:** A margem exibida é estritamente a margem informada pela Kaiross para fins administrativos internos, sem promessa de lucro.
