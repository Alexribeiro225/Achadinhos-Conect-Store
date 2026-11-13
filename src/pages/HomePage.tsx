import React from 'react';
import { Flame, Zap, Star, Search, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BannerHero } from '../components/BannerHero';
import { CategoryNav } from '../components/CategoryNav';
import { ProductSection } from '../components/ProductSection';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const {
    activeProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    loading
  } = useStore();

  // Filtragem combinada por busca e categoria
  const filteredProducts = activeProducts.filter((product) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descricao_curta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || product.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const isFiltering = searchTerm.trim() !== '' || selectedCategory !== null;

  // Seções temáticas quando não houver filtro ativo
  const achadinhos = activeProducts.filter(
    (p) => p.secao_destaque === 'achadinhos' || (p.destaque && p.ordem <= 4)
  );

  const ofertas = activeProducts.filter(
    (p) => p.secao_destaque === 'ofertas' || (p.preco_anterior && p.preco_anterior > p.preco_venda)
  );

  const populares = activeProducts.filter(
    (p) => p.secao_destaque === 'populares' || (p.cliques && p.cliques > 100)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      {/* Banner de Destaque Superior */}
      <BannerHero />

      {/* Navegação de Categorias */}
      <CategoryNav />

      {/* Conteúdo Dinâmico */}
      <main className="flex-1">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#FF681B] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-gray-500">
              Carregando as melhores ofertas para você...
            </p>
          </div>
        ) : isFiltering ? (
          // Visualização de Resultados Filtrados / Pesquisa
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 mb-6 gap-2">
              <div>
                <span className="text-xs font-bold text-[#FF681B] uppercase tracking-wider">
                  Resultados Filtrados
                </span>
                <h2 className="text-2xl font-extrabold text-[#171717]">
                  {searchTerm ? `Buscando por "${searchTerm}"` : selectedCategory}
                </h2>
                <p className="text-xs text-gray-500">
                  {filteredProducts.length}{' '}
                  {filteredProducts.length === 1
                    ? 'produto encontrado'
                    : 'produtos encontrados'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-full font-semibold transition"
                  >
                    Remover filtro de categoria
                  </button>
                )}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-xs bg-[#FF681B] text-white px-3 py-1.5 rounded-full font-semibold transition hover:bg-[#e6560e]"
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-xl mx-auto my-8 shadow-sm">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#171717] mb-1">
                  Nenhum produto encontrado
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Não encontramos ofertas correspondentes à sua pesquisa. Tente usar outros termos ou explore todas as categorias.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }}
                  className="px-6 py-2.5 bg-[#FF681B] text-white font-bold text-xs rounded-xl hover:bg-[#e6560e] transition"
                >
                  Ver Todos os Produtos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        ) : activeProducts.length === 0 ? (
          // Visualização Padrão: 3 Seções Obrigatórias
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-4">
              <div className="w-14 h-14 bg-orange-50 text-[#FF681B] rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-[#171717]">
                Novos Achadinhos em Preparação
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
                Nossa equipe está auditando preços, fornecedores e links de checkout na <strong>Kaiross</strong> para disponibilizar apenas ofertas verificadas com descontos reais.
              </p>
              <div className="pt-2 text-xs text-gray-400">
                Volte em instantes para conferir as novidades ou acesse o <strong>Painel Admin</strong> para ativar os produtos verificados.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 1. Achadinhos do momento */}
            <ProductSection
              id="secao-achadinhos"
              title="Achadinhos do Momento"
              subtitle="Itens virais, práticos e inovadores que facilitam a sua vida"
              badgeText="TENDÊNCIAS EM ALTA"
              icon={<Flame className="w-7 h-7 text-[#FF681B] fill-current" />}
              products={achadinhos}
            />

            {/* Banner Divisor Intermediário */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="bg-gradient-to-r from-[#171717] via-[#241e1a] to-[#171717] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#382d24] shadow-md">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#FFD43B] text-[#171717] px-3 py-1 rounded-full text-xs font-black uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    COMPRA SEGURA KAIROSS
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Gostou de uma novidade?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                    Finalize seu pedido em menos de 2 minutos diretamente na plataforma oficial Kaiross com Pix, cartão de crédito ou boleto e entrega rastreada.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href="#secao-ofertas"
                    className="px-6 py-3.5 bg-[#FFD43B] hover:bg-[#e6bd35] text-[#171717] font-black rounded-2xl shadow transition text-xs sm:text-sm inline-flex items-center gap-2"
                  >
                    <span>CONFERIR OFERTAS IMPERDÍVEIS</span>
                    <Zap className="w-4 h-4 fill-current" />
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Ofertas imperdíveis */}
            <ProductSection
              id="secao-ofertas"
              title="Ofertas Imperdíveis"
              subtitle="Descontos reais calculados com o melhor custo-benefício comprovado"
              badgeText="DESCONTOS REAIS"
              icon={<Zap className="w-7 h-7 text-[#FFD43B] fill-current" />}
              products={ofertas}
            />

            {/* 3. Mais populares */}
            <ProductSection
              id="secao-populares"
              title="Mais Populares"
              subtitle="Os produtos mais buscados e desejados pelos nossos clientes"
              badgeText="CAMPEÕES DE PEDIDOS"
              icon={<Star className="w-7 h-7 text-[#FF681B] fill-current" />}
              products={populares}
            />
          </div>
        )}
      </main>
    </div>
  );
};
