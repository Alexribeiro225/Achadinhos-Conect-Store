import { Product, AdminStats } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'conect_store_products_v2';

export const storageService = {
  // Obter todos os produtos (públicos ativos para visitantes, todos para admin autenticado)
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('ordem', { ascending: true });

          if (!error && data) {
            // Se o usuário for admin, buscar contagem real de cliques por produto
            const isAdmin = await this.checkIsAdmin();
            if (isAdmin) {
              const productsWithClicks = await Promise.all(
                data.map(async (p) => {
                  try {
                    const { count } = await supabase
                      .from('click_events')
                      .select('*', { count: 'exact', head: true })
                      .eq('product_id', p.id);
                    return { ...p, cliques: count || 0 };
                  } catch {
                    return { ...p, cliques: 0 };
                  }
                })
              );
              return productsWithClicks as Product[];
            }

            return data as Product[];
          } else if (error) {
            console.warn('Erro ao consultar Supabase products:', error.message);
          }
        } catch (err) {
          console.warn('Erro de conexão com Supabase, utilizando fallback local:', err);
        }
      }
    }

    // Fallback: LocalStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler LocalStorage:', e);
    }

    // Inicialização com dados padrão
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  // Salvar ou atualizar produto (Restrito a administradores no Supabase por RLS)
  async saveProduct(product: Product): Promise<{ product: Product | null; error: string | null }> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          // Prepara payload compatível com a tabela products
          const payload = {
            id: product.id || undefined,
            nome: product.nome,
            slug: product.slug,
            descricao_curta: product.descricao_curta,
            descricao_completa: product.descricao_completa,
            categoria: product.categoria,
            imagens: product.imagens || [],
            preco_custo: product.preco_custo,
            preco_venda: product.preco_venda,
            preco_anterior: product.preco_anterior || null,
            margem_estimada: product.margem_estimada,
            link_checkout_kaiross: product.link_checkout_kaiross,
            status: product.status,
            destaque: product.destaque,
            secao_destaque: product.secao_destaque,
            etiqueta_oferta: product.etiqueta_oferta || null,
            especificacoes: product.especificacoes || [],
            beneficios: product.beneficios || [],
            ordem: product.ordem || 0
          };

          const { data, error } = await supabase
            .from('products')
            .upsert(payload)
            .select()
            .single();

          if (error) {
            return { product: null, error: error.message };
          }

          return { product: data as Product, error: null };
        } catch (err: any) {
          return { product: null, error: err.message || 'Erro inesperado ao salvar no Supabase' };
        }
      }
    }

    // LocalStorage fallback
    const products = await this.getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);

    let updatedProducts: Product[];
    if (existingIndex >= 0) {
      updatedProducts = [...products];
      updatedProducts[existingIndex] = product;
    } else {
      updatedProducts = [product, ...products];
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProducts));
    return { product, error: null };
  },

  // Excluir produto
  async deleteProduct(id: string): Promise<{ success: boolean; error: string | null }> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

          if (error) {
            return { success: false, error: error.message };
          }
          return { success: true, error: null };
        } catch (err: any) {
          return { success: false, error: err.message || 'Erro ao excluir no Supabase' };
        }
      }
    }

    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return { success: true, error: null };
  },

  // Alternar status (ativo / pausado)
  async toggleStatus(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    const target = products.find((p) => p.id === id);
    if (!target) return null;

    const newStatus = target.status === 'ativo' ? 'pausado' : 'ativo';
    const updated = { ...target, status: newStatus as 'ativo' | 'pausado' };
    const res = await this.saveProduct(updated);
    return res.product;
  },

  // Registrar clique real no link de afiliado Kaiross
  async recordClick(productId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          // Usa a função segura RPC ou faz insert direto em click_events
          await supabase.rpc('record_click', {
            p_product_id: productId,
            p_source: 'storefront'
          });
          return;
        } catch (err) {
          console.warn('Erro ao registrar clique via RPC, tentando insert direto:', err);
          try {
            await supabase.from('click_events').insert({
              product_id: productId,
              source: 'storefront'
            });
            return;
          } catch (insertErr) {
            console.error('Falha ao registrar clique no Supabase:', insertErr);
          }
        }
      }
    }

    // Local fallback
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === productId);
      if (product) {
        product.cliques = (product.cliques || 0) + 1;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
      }
    } catch (e) {
      console.error('Erro ao atualizar cliques localmente:', e);
    }
  },

  // Obter total real de cliques cadastrados em click_events
  async getTotalRealClicks(): Promise<number> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { count, error } = await supabase
            .from('click_events')
            .select('*', { count: 'exact', head: true });

          if (!error && count !== null) {
            return count;
          }
        } catch (err) {
          console.warn('Erro ao contar cliques no Supabase:', err);
        }
      }
    }

    // Fallback local: soma dos cliques
    try {
      const products = await this.getProducts();
      return products.reduce((acc, p) => acc + (p.cliques || 0), 0);
    } catch {
      return 0;
    }
  },

  // Upload de Imagens para o Bucket 'product-images' no Supabase Storage
  async uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { url: null, error: 'Supabase não configurado. Adicione a URL e Chave Anon.' };
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return { url: null, error: 'Cliente Supabase não inicializado.' };
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const filePath = `products/${Date.now()}_${cleanFileName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      const { data: publicData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return { url: publicData.publicUrl, error: null };
    } catch (err: any) {
      return { url: null, error: err.message || 'Erro inesperado no upload' };
    }
  },

  // Excluir imagem do Bucket
  async deleteProductImage(imageUrl: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      // Extrair o path dentro do bucket
      const parts = imageUrl.split('/product-images/');
      if (parts.length > 1) {
        const filePath = parts[1];
        const { error } = await supabase.storage.from('product-images').remove([filePath]);
        return !error;
      }
      return false;
    } catch {
      return false;
    }
  },

  // ==========================================
  // AUTENTICAÇÃO COM SUPABASE AUTH & ADMIN_USERS
  // ==========================================

  // Checar se o usuário atual logado está cadastrado na tabela admin_users
  async checkIsAdmin(): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return false;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data && data.user_id) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  },

  // Login com e-mail e senha via Supabase Auth
  async signInAdmin(email: string, password: string): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase não está configurado. Conecte sua conta do Supabase para fazer login com segurança.'
      };
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: 'Cliente Supabase não disponível.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Usuário não autenticado.' };
      }

      // Verificar se consta na tabela admin_users
      const { data: adminRow, error: adminErr } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminErr) {
        // Encerra a sessão imediatamente para impedir acesso indevido
        await supabase.auth.signOut();
        return {
          success: false,
          error: `Não foi possível verificar as permissões na tabela admin_users: ${adminErr.message}`
        };
      }

      if (!adminRow) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: `Acesso negado. UUID autenticado: ${data.user.id}. Cadastre esse UUID em public.admin_users no mesmo projeto Supabase.`
        };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro inesperado na autenticação.' };
    }
  },

  // Encerrar sessão
  async signOutAdmin(): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Erro ao sair do Supabase:', e);
      }
    }
  },

  // Obter sessão atual
  async getCurrentUser() {
    const supabase = getSupabaseClient();
    if (!supabase) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch {
      return null;
    }
  },

  // Calcular estatísticas com dados reais
  calculateStats(products: Product[], totalRealClicks: number): AdminStats {
    const totalProdutos = products.length;
    const produtosAtivos = products.filter((p) => p.status === 'ativo').length;
    const produtosPausados = products.filter((p) => p.status === 'pausado').length;

    const totalMargem = products.reduce((acc, p) => acc + (p.margem_estimada || 0), 0);
    const margemMediaEstimada = totalProdutos > 0 ? totalMargem / totalProdutos : 0;

    return {
      totalProdutos,
      produtosAtivos,
      produtosPausados,
      totalCliques: totalRealClicks,
      margemMediaEstimada
    };
  }
};
