import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, AdminStats } from '../types';
import { storageService } from '../services/storageService';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabaseClient';

interface StoreContextType {
  products: Product[];
  activeProducts: Product[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  currentView: 'home' | 'product-detail' | 'admin';
  activeProductSlug: string | null;
  activeProduct: Product | null;
  navigateToHome: () => void;
  navigateToProduct: (slug: string) => void;
  navigateToAdmin: () => void;
  handleKairossCheckout: (product: Product) => void;
  saveProduct: (product: Product) => Promise<{ success: boolean; error: string | null }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error: string | null }>;
  toggleProductStatus: (id: string) => Promise<void>;
  isAdmin: boolean;
  adminUserEmail: string | null;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  logoutAdmin: () => Promise<void>;
  uploadProductImage: (file: File) => Promise<{ url: string | null; error: string | null }>;
  stats: AdminStats;
  refreshProducts: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalRealClicks, setTotalRealClicks] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'product-detail' | 'admin'>('home');
  const [activeProductSlug, setActiveProductSlug] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUserEmail, setAdminUserEmail] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await storageService.getProducts();
      setProducts(data);

      const clicks = await storageService.getTotalRealClicks();
      setTotalRealClicks(clicks);

      const isAdm = await storageService.checkIsAdmin();
      setIsAdmin(isAdm);
      if (isAdm) {
        const user = await storageService.getCurrentUser();
        setAdminUserEmail(user?.email || null);
      } else {
        setAdminUserEmail(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Sincronizar com rota pela hash da URL
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/produto/')) {
        const slug = hash.replace('#/produto/', '');
        setActiveProductSlug(slug);
        setCurrentView('product-detail');
      } else if (hash === '#/admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    // Escutar eventos de autenticação do Supabase
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const isAdm = await storageService.checkIsAdmin();
            setIsAdmin(isAdm);
            setAdminUserEmail(isAdm ? session.user.email || null : null);
          } else {
            setIsAdmin(false);
            setAdminUserEmail(null);
          }
        });

        return () => {
          window.removeEventListener('hashchange', handleHashChange);
          authListener.subscription.unsubscribe();
        };
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [loadData]);

  const navigateToHome = () => {
    setCurrentView('home');
    setActiveProductSlug(null);
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (slug: string) => {
    setActiveProductSlug(slug);
    setCurrentView('product-detail');
    window.location.hash = `#/produto/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setCurrentView('admin');
    window.location.hash = '#/admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Botão "COMPRAR AGORA": registra o evento de clique na tabela click_events antes de abrir o link em nova aba
  const handleKairossCheckout = (product: Product) => {
    // 1. Registra clique de forma assíncrona sem travar o redirecionamento
    storageService.recordClick(product.id).catch((err) => {
      console.warn('Falha ao registrar clique:', err);
    });

    setTotalRealClicks((prev) => prev + 1);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, cliques: (p.cliques || 0) + 1 } : p))
    );

    // 2. Abre o link individual de checkout Kaiross em nova aba
    if (product.link_checkout_kaiross) {
      window.open(product.link_checkout_kaiross, '_blank', 'noopener,noreferrer');
    } else {
      alert('Link de checkout da Kaiross não cadastrado para este produto.');
    }
  };

  const saveProduct = async (product: Product): Promise<{ success: boolean; error: string | null }> => {
    const res = await storageService.saveProduct(product);
    if (!res.error) {
      await loadData();
      return { success: true, error: null };
    }
    return { success: false, error: res.error };
  };

  const deleteProduct = async (id: string): Promise<{ success: boolean; error: string | null }> => {
    const res = await storageService.deleteProduct(id);
    if (res.success) {
      await loadData();
      return { success: true, error: null };
    }
    return { success: false, error: res.error };
  };

  const toggleProductStatus = async (id: string) => {
    await storageService.toggleStatus(id);
    await loadData();
  };

  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error: string | null }> => {
    const res = await storageService.signInAdmin(email, password);
    if (res.success) {
      setIsAdmin(true);
      await loadData();
    }
    return res;
  };

  const logoutAdmin = async () => {
    await storageService.signOutAdmin();
    setIsAdmin(false);
    setAdminUserEmail(null);
    await loadData();
  };

  const uploadProductImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
    return await storageService.uploadProductImage(file);
  };

  const activeProducts = products.filter((p) => p.status === 'ativo');
  const activeProduct = products.find((p) => p.slug === activeProductSlug) || null;
  const stats = storageService.calculateStats(products, totalRealClicks);

  return (
    <StoreContext.Provider
      value={{
        products,
        activeProducts,
        loading,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        currentView,
        activeProductSlug,
        activeProduct,
        navigateToHome,
        navigateToProduct,
        navigateToAdmin,
        handleKairossCheckout,
        saveProduct,
        deleteProduct,
        toggleProductStatus,
        isAdmin,
        adminUserEmail,
        loginAdmin,
        logoutAdmin,
        uploadProductImage,
        stats,
        refreshProducts: loadData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
