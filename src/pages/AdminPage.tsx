import React, { useState } from 'react';
import { 
  Lock, 
  Plus, 
  Trash2, 
  Edit3, 
  Power, 
  ExternalLink, 
  BarChart3, 
  Database, 
  MousePointerClick, 
  TrendingUp, 
  Layers, 
  LogOut, 
  X, 
  Check, 
  AlertCircle,
  Copy,
  Download,
  Upload,
  Home,
  ShieldCheck,
  Image as ImageIcon,
  KeyRound
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductHighlightSection } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialProducts';
import { getStoredSupabaseConfig, saveSupabaseConfig, isSupabaseConfigured } from '../services/supabaseClient';

export const AdminPage: React.FC = () => {
  const { 
    products, 
    stats, 
    isAdmin, 
    adminUserEmail,
    loginAdmin, 
    logoutAdmin, 
    saveProduct, 
    deleteProduct, 
    toggleProductStatus,
    uploadProductImage,
    navigateToHome
  } = useStore();

  // Estado de Login via Supabase Auth
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);

  // Filtros da tabela
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchTable, setSearchTable] = useState<string>('');

  // Modal de Produto (Novo / Edição)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [modalFormError, setModalFormError] = useState<string | null>(null);

  // Aba ativa: 'produtos' | 'supabase'
  const [activeTab, setActiveTab] = useState<'produtos' | 'supabase'>('produtos');

  // Configuração Supabase
  const [supabaseConfig, setSupabaseConfigState] = useState(getStoredSupabaseConfig());
  const [configSaved, setConfigSaved] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Submissão do login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginErrorMsg(null);

    try {
      const res = await loginAdmin(emailInput, passwordInput);
      if (!res.success) {
        setLoginErrorMsg(res.error || 'Credenciais inválidas.');
      } else {
        setEmailInput('');
        setPasswordInput('');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Se não autenticado ou não autorizado, exibe tela de login Supabase Auth
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center p-4">
        <div className="bg-[#222222] border border-gray-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-white">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FF681B] flex items-center justify-center text-white mb-3 shadow-brand">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold">Painel Administrativo</h2>
            <p className="text-xs text-gray-400 mt-1">
              CONECT STORE OFERTAS 2.0 &bull; Autenticação Supabase Auth
            </p>
          </div>

          {!isSupabaseConfigured() && (
            <div className="mb-6 p-4 bg-amber-950/40 border border-amber-800 rounded-2xl text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Supabase não configurado neste ambiente</span>
              </div>
              <p>
                Para habilitar o login seguro com Supabase Auth e o armazenamento de imagens no bucket <code>product-images</code>, informe suas chaves de API abaixo:
              </p>
              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  placeholder="VITE_SUPABASE_URL (ex: https://xyz.supabase.co)"
                  value={supabaseConfig.url}
                  onChange={(e) => setSupabaseConfigState({ ...supabaseConfig, url: e.target.value })}
                  className="w-full bg-[#171717] border border-amber-700/60 rounded-xl px-3 py-2 text-xs text-white"
                />
                <input
                  type="password"
                  placeholder="VITE_SUPABASE_ANON_KEY (anon public key)"
                  value={supabaseConfig.anonKey}
                  onChange={(e) => setSupabaseConfigState({ ...supabaseConfig, anonKey: e.target.value })}
                  className="w-full bg-[#171717] border border-amber-700/60 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    saveSupabaseConfig(supabaseConfig);
                    window.location.reload();
                  }}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-xl transition text-xs"
                >
                  Salvar Credenciais do Supabase
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                E-mail do Administrador
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setLoginErrorMsg(null);
                }}
                placeholder="seu-email@dominio.com"
                className="w-full bg-[#171717] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF681B]"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setLoginErrorMsg(null);
                }}
                placeholder="••••••••••••"
                className="w-full bg-[#171717] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF681B]"
              />
            </div>

            {loginErrorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{loginErrorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-[#FF681B] hover:bg-[#e6560e] text-white font-bold text-sm rounded-xl transition shadow-brand disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Entrar com Supabase Auth</span>
                </>
              )}
            </button>
          </form>

          {/* Guia Seguro de Primeiro Acesso */}
          <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-400 space-y-3">
            <div className="bg-[#171717] p-3 rounded-xl border border-gray-800 space-y-1.5">
              <span className="font-bold text-[#FFD43B] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                Segurança RLS & admin_users:
              </span>
              <p className="text-[11px] leading-relaxed text-gray-300">
                O acesso administrativo exige que seu usuário esteja cadastrado no <strong>Supabase Auth</strong> e que o UUID conste na tabela <code>admin_users</code>.
              </p>
              <p className="text-[10px] text-gray-400 font-mono">
                INSERT INTO public.admin_users (user_id) VALUES ('SEU-UUID');
              </p>
            </div>

            <button
              onClick={navigateToHome}
              className="text-xs text-gray-400 hover:text-white transition flex items-center justify-center gap-1 mx-auto"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Voltar para a Loja Pública</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Abertura do modal para novo produto
  const handleOpenNewProduct = () => {
    setEditingProduct({
      id: '',
      nome: '',
      slug: '',
      descricao_curta: '',
      descricao_completa: '',
      categoria: 'Casa e cozinha',
      imagens: [],
      preco_custo: 0,
      preco_venda: 0,
      preco_anterior: null,
      margem_estimada: 0,
      link_checkout_kaiross: '',
      status: 'pausado', // Inicia pausado até conferência do lojista
      destaque: false,
      secao_destaque: 'achadinhos',
      ordem: products.length + 1,
      etiqueta_oferta: 'OFERTA',
      especificacoes: [],
      beneficios: []
    });
    setModalFormError(null);
    setTempImageUrl('');
    setIsModalOpen(true);
  };

  // Abertura do modal para edição
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setModalFormError(null);
    setTempImageUrl('');
    setIsModalOpen(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Salvar Produto via Form
  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalFormError(null);

    if (!editingProduct || !editingProduct.nome || !editingProduct.preco_venda) {
      setModalFormError('Por favor, informe ao menos o nome e o preço de venda do produto.');
      return;
    }

    if (!editingProduct.link_checkout_kaiross) {
      setModalFormError('O link individual de checkout da Kaiross é obrigatório.');
      return;
    }

    const finalProduct: Product = {
      id: editingProduct.id || '',
      nome: editingProduct.nome,
      slug: editingProduct.slug || generateSlug(editingProduct.nome),
      descricao_curta: editingProduct.descricao_curta || '',
      descricao_completa: editingProduct.descricao_completa || editingProduct.descricao_curta || '',
      categoria: editingProduct.categoria || 'Casa e cozinha',
      imagens: editingProduct.imagens || [],
      preco_custo: Number(editingProduct.preco_custo) || 0,
      preco_venda: Number(editingProduct.preco_venda) || 0,
      preco_anterior: editingProduct.preco_anterior ? Number(editingProduct.preco_anterior) : null,
      margem_estimada: Number(editingProduct.margem_estimada) || 0,
      link_checkout_kaiross: editingProduct.link_checkout_kaiross,
      status: editingProduct.status || 'pausado',
      destaque: Boolean(editingProduct.destaque),
      secao_destaque: (editingProduct.secao_destaque as ProductHighlightSection) || 'achadinhos',
      ordem: Number(editingProduct.ordem) || 1,
      etiqueta_oferta: editingProduct.etiqueta_oferta || '',
      especificacoes: editingProduct.especificacoes || [],
      beneficios: editingProduct.beneficios || []
    };

    const res = await saveProduct(finalProduct);
    if (!res.success) {
      setModalFormError(res.error || 'Erro ao salvar produto.');
      return;
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Upload de arquivo de imagem para o Supabase Storage (bucket product-images)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    setUploadingImage(true);
    setModalFormError(null);

    try {
      const file = files[0];
      const res = await uploadProductImage(file);
      if (res.error || !res.url) {
        setModalFormError(`Falha no upload para o Supabase Storage: ${res.error}`);
      } else {
        setEditingProduct({
          ...editingProduct,
          imagens: [...(editingProduct.imagens || []), res.url]
        });
      }
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Adicionar URL de Imagem manual
  const handleAddImageUrl = () => {
    if (tempImageUrl.trim() && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        imagens: [...(editingProduct.imagens || []), tempImageUrl.trim()]
      });
      setTempImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (editingProduct && editingProduct.imagens) {
      const updated = editingProduct.imagens.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, imagens: updated });
    }
  };

  // Salvar configuração Supabase
  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseConfig);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  // Exportar Backup JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `conect_store_catalog_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copiar SQL
  const handleCopySql = () => {
    const sql = `-- Script de Configuração Supabase - Conect Store Ofertas 2.0
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Consulte supabase/migrations/20261111000000_conect_store_v2.sql para o script completo.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sql);
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 2500);
    }
  };

  // Filtragem da tabela administrativa
  const filteredTableProducts = products.filter((p) => {
    const matchesCat = filterCategory === 'todos' || p.categoria === filterCategory;
    const matchesStat = filterStatus === 'todos' || p.status === filterStatus;
    const matchesSearch =
      searchTable.trim() === '' ||
      p.nome.toLowerCase().includes(searchTable.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTable.toLowerCase());
    return matchesCat && matchesStat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-16">
      {/* Top Bar Admin */}
      <div className="bg-[#171717] text-white px-4 sm:px-8 py-4 border-b border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF681B] flex items-center justify-center font-bold text-lg">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2">
              Painel de Gestão Comercial
              <span className="text-[10px] bg-[#FFD43B] text-[#171717] px-2 py-0.5 rounded font-black uppercase">
                V2.0 &bull; Supabase RLS
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Autenticado como: <strong className="text-white">{adminUserEmail || 'Administrador'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={navigateToHome}
            className="px-3.5 py-2 bg-[#262626] hover:bg-[#333333] text-gray-200 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Home className="w-4 h-4 text-[#FFD43B]" />
            <span>Ver Vitrine Loja</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Indicadores Administrativos com Dados Reais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Produtos Ativos
              </p>
              <h3 className="text-3xl font-black text-[#171717] mt-1">
                {stats.produtosAtivos}
              </h3>
              <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Visíveis ao público
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Produtos Pausados
              </p>
              <h3 className="text-3xl font-black text-[#171717] mt-1">
                {stats.produtosPausados}
              </h3>
              <span className="text-[11px] text-gray-400 font-semibold mt-0.5 block">
                Em auditoria / Ocultos
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center">
              <Power className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Total de Cliques Reais
              </p>
              <h3 className="text-3xl font-black text-[#FF681B] mt-1">
                {stats.totalCliques}
              </h3>
              <span className="text-[11px] text-gray-500 font-semibold mt-0.5 block">
                Eventos em click_events
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF681B] flex items-center justify-center">
              <MousePointerClick className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Margem Estimada Média
              </p>
              <h3 className="text-3xl font-black text-[#171717] mt-1">
                {stats.margemMediaEstimada.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </h3>
              <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                *Informada pela Kaiross (estimativa)
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FFD43B] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>

        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('produtos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'produtos'
                ? 'bg-[#FF681B] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Gestão de Catálogo ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'supabase'
                ? 'bg-[#FF681B] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Configuração Supabase & Storage</span>
            {isSupabaseConfigured() && (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            )}
          </button>
        </div>

        {/* ABA: GESTÃO DE PRODUTOS */}
        {activeTab === 'produtos' && (
          <div className="space-y-4">
            
            {/* Filtros e Ações */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Buscar por nome ou ID..."
                  value={searchTable}
                  onChange={(e) => setSearchTable(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#FF681B] w-full sm:w-48"
                />

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none"
                >
                  <option value="todos">Todas as Categorias</option>
                  {INITIAL_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.nome}>
                      {c.nome}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="ativo">Ativos (Publicados)</option>
                  <option value="pausado">Pausados (Em auditoria)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenNewProduct}
                  className="px-4 py-2.5 bg-[#FF681B] hover:bg-[#e6560e] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-brand whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Novo Produto</span>
                </button>
              </div>
            </div>

            {/* Tabela de Produtos */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Produto</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Preço Venda</th>
                      <th className="py-3 px-4">Custo / Margem Est.</th>
                      <th className="py-3 px-4 text-center">Cliques Reais</th>
                      <th className="py-3 px-4 text-center">Ordem</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTableProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-400">
                          Nenhum produto encontrado com os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredTableProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-50/80 transition">
                          
                          {/* Produto e Foto */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  prod.imagens && prod.imagens.length > 0
                                    ? prod.imagens[0]
                                    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'
                                }
                                alt={prod.nome}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                              />
                              <div className="max-w-xs">
                                <span className="font-bold text-[#171717] block line-clamp-1">
                                  {prod.nome}
                                </span>
                                <span className="text-[10px] text-gray-400 block font-mono">
                                  ID: {prod.id.slice(0, 8)}...
                                </span>
                                {prod.destaque && (
                                  <span className="inline-block bg-[#FFD43B] text-[#171717] text-[9px] font-black px-1.5 py-0.2 rounded mt-0.5">
                                    ★ DESTAQUE ({prod.secao_destaque})
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Categoria */}
                          <td className="py-3 px-4 font-semibold text-gray-700">
                            {prod.categoria}
                          </td>

                          {/* Preço de Venda */}
                          <td className="py-3 px-4">
                            <span className="font-extrabold text-[#171717] text-sm">
                              {prod.preco_venda.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              })}
                            </span>
                            {prod.preco_anterior && (
                              <span className="block text-[10px] text-gray-400 line-through">
                                De: {prod.preco_anterior.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                })}
                              </span>
                            )}
                          </td>

                          {/* Custo e Margem Kaiross */}
                          <td className="py-3 px-4">
                            <span className="text-gray-500 block">
                              Custo: {prod.preco_custo.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              })}
                            </span>
                            <span className="text-green-700 font-bold text-[11px] block">
                              Margem: {prod.margem_estimada.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              })}
                            </span>
                          </td>

                          {/* Cliques Reais */}
                          <td className="py-3 px-4 text-center">
                            <span className="bg-orange-50 text-[#FF681B] font-extrabold px-2.5 py-1 rounded-full text-xs">
                              {prod.cliques || 0}
                            </span>
                          </td>

                          {/* Ordem */}
                          <td className="py-3 px-4 text-center font-bold text-gray-600">
                            #{prod.ordem}
                          </td>

                          {/* Status Toggle */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => toggleProductStatus(prod.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition ${
                                prod.status === 'ativo'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {prod.status}
                            </button>
                          </td>

                          {/* Ações */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={prod.link_checkout_kaiross}
                                target="_blank"
                                rel="noreferrer"
                                title="Abrir link Kaiross cadastrado"
                                className="p-1.5 text-gray-400 hover:text-[#FF681B] hover:bg-orange-50 rounded-lg transition"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                title="Editar Produto"
                                className="p-1.5 text-gray-600 hover:text-[#FF681B] hover:bg-orange-50 rounded-lg transition"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Excluir permanentemente "${prod.nome}"?`)) {
                                    const res = await deleteProduct(prod.id);
                                    if (!res.success) {
                                      alert(`Erro ao excluir: ${res.error}`);
                                    }
                                  }
                                }}
                                title="Excluir Produto"
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ABA: SUPABASE, STORAGE & BACKUP */}
        {activeTab === 'supabase' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Painel de Credenciais */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#171717]">
                    Conexão Supabase
                  </h3>
                  <p className="text-xs text-gray-500">
                    Sincronização com PostgreSQL, Supabase Auth e Bucket Storage <code>product-images</code>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSupabase} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseConfig.url}
                    onChange={(e) =>
                      setSupabaseConfigState({ ...supabaseConfig, url: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#FF681B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Supabase Anon Public Key
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseConfig.anonKey}
                    onChange={(e) =>
                      setSupabaseConfigState({ ...supabaseConfig, anonKey: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#FF681B]"
                  />
                </div>

                {configSaved && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Configuração salva com sucesso!</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Status:{' '}
                    {isSupabaseConfigured() ? (
                      <strong className="text-green-600">Conectado ao Supabase</strong>
                    ) : (
                      <strong className="text-amber-600">Não configurado</strong>
                    )}
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FF681B] hover:bg-[#e6560e] text-white text-xs font-bold rounded-xl transition shadow-brand"
                  >
                    Salvar Conexão
                  </button>
                </div>
              </form>
            </div>

            {/* Script SQL & Backup */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#171717]">
                    Migração SQL & Políticas RLS
                  </h3>
                  <button
                    onClick={handleCopySql}
                    className="text-xs font-bold text-[#FF681B] hover:underline flex items-center gap-1"
                  >
                    {sqlCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    <span>{sqlCopied ? 'Copiado!' : 'Copiar Referência'}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  O script completo com as tabelas <code>products</code>, <code>admin_users</code>, <code>click_events</code> e as políticas de storage está salvo em:
                  <br />
                  <code className="text-[#FF681B] font-mono text-[11px]">
                    supabase/migrations/20261111000000_conect_store_v2.sql
                  </code>
                </p>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1">
                  <span className="font-bold text-gray-700">Para cadastrar o 1º Administrador:</span>
                  <ol className="list-decimal pl-4 space-y-1 text-gray-600 text-[11px]">
                    <li>Crie o usuário no Supabase Auth (Authentication &gt; Users &gt; Add User).</li>
                    <li>Copie o User UID gerado.</li>
                    <li>Execute no SQL Editor: <code>INSERT INTO public.admin_users (user_id) VALUES ('UUID');</code></li>
                  </ol>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-[#171717]">
                  Backup do Catálogo
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportJson}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#171717] rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-[#FF681B]" />
                    <span>Exportar Produtos em JSON</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO DE PRODUTO */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 sm:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-[#171717] hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#171717] mb-4">
              {editingProduct.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h3>

            {modalFormError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              
              {/* Nome e Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.nome || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingProduct({
                        ...editingProduct,
                        nome: val,
                        slug: generateSlug(val)
                      });
                    }}
                    placeholder="Ex: Fone Bluetooth Sem Fio TWS"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF681B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={editingProduct.categoria || 'Casa e cozinha'}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, categoria: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF681B]"
                  >
                    {INITIAL_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.nome}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Slug e Etiqueta Promocional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Slug da URL
                  </label>
                  <input
                    type="text"
                    value={editingProduct.slug || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, slug: e.target.value })
                    }
                    placeholder="fone-bluetooth-sem-fio"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Etiqueta Promocional
                  </label>
                  <input
                    type="text"
                    value={editingProduct.etiqueta_oferta || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, etiqueta_oferta: e.target.value })
                    }
                    placeholder="Ex: ACHADINHO VIRAL, OFERTA RELÂMPAGO, 30% OFF"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Preços e Margem Estimada Kaiross */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Custo Fornecedor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.preco_custo || 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        preco_custo: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Preço de Venda (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.preco_venda || 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        preco_venda: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-[#FF681B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Preço Anterior (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.preco_anterior || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        preco_anterior: e.target.value ? parseFloat(e.target.value) : null
                      })
                    }
                    placeholder="Desconto real"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Margem Est. Kaiross (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.margem_estimada || 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        margem_estimada: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-green-700 font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Link individual de checkout Kaiross */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Link Individual de Checkout / Afiliado Kaiross *
                </label>
                <input
                  type="url"
                  required
                  value={editingProduct.link_checkout_kaiross || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      link_checkout_kaiross: e.target.value
                    })
                  }
                  placeholder="https://kaiross.com/checkout/seu-produto?ref=conectstore"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF681B]"
                />
              </div>

              {/* Descrições */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Descrição Curta (Vitrine)
                </label>
                <input
                  type="text"
                  value={editingProduct.descricao_curta || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, descricao_curta: e.target.value })
                  }
                  placeholder="Resumo em 1 frase para chamar a atenção"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Descrição Completa
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.descricao_completa || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, descricao_completa: e.target.value })
                  }
                  placeholder="Detalhes completos sobre como o produto funciona e diferenciais..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              {/* Armazenamento de Imagens: Supabase Storage Bucket product-images & URLs */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#FF681B]" />
                    <span>Fotos do Produto (Bucket product-images)</span>
                  </label>
                  {uploadingImage && (
                    <span className="text-[11px] text-[#FF681B] font-bold animate-pulse">
                      Enviando para o Supabase Storage...
                    </span>
                  )}
                </div>

                {/* Upload de arquivo direto */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 cursor-pointer bg-white border border-dashed border-gray-300 hover:border-[#FF681B] rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 transition">
                    <Upload className="w-4 h-4 text-[#FF681B]" />
                    <span>Fazer Upload de Foto do Dispositivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  <div className="flex gap-2 flex-1">
                    <input
                      type="url"
                      placeholder="Ou cole uma URL externa..."
                      value={tempImageUrl}
                      onChange={(e) => setTempImageUrl(e.target.value)}
                      className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-gray-200 hover:bg-[#FF681B] hover:text-white rounded-xl text-xs font-bold transition"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Pré-visualização das Imagens */}
                {editingProduct.imagens && editingProduct.imagens.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto pt-2">
                    {editingProduct.imagens.map((img, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 group">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status, Seção e Ordem */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Ordem na Vitrine
                  </label>
                  <input
                    type="number"
                    value={editingProduct.ordem || 1}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        ordem: parseInt(e.target.value) || 1
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Seção Principal
                  </label>
                  <select
                    value={editingProduct.secao_destaque || 'achadinhos'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        secao_destaque: e.target.value as ProductHighlightSection
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="achadinhos">Achadinhos do momento</option>
                    <option value="ofertas">Ofertas imperdíveis</option>
                    <option value="populares">Mais populares</option>
                    <option value="geral">Catálogo Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingProduct.status || 'pausado'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        status: e.target.value as 'ativo' | 'pausado'
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="pausado">Pausado (Em auditoria)</option>
                    <option value="ativo">Ativo (Publicado)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="destaque-check"
                    checked={Boolean(editingProduct.destaque)}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        destaque: e.target.checked
                      })
                    }
                    className="w-4 h-4 text-[#FF681B] rounded focus:ring-0"
                  />
                  <label htmlFor="destaque-check" className="text-xs font-bold text-gray-700">
                    Produto em Destaque
                  </label>
                </div>
              </div>

              {/* Botões do Rodapé */}
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF681B] hover:bg-[#e6560e] text-white text-xs font-bold rounded-xl transition shadow-brand"
                >
                  Salvar Produto
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
