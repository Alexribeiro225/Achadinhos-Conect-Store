import React, { useState } from 'react';
import { Search, Flame, ShieldCheck, Lock, Menu, X, Tag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_CATEGORIES } from '../data/initialProducts';

export const Header: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    navigateToHome,
    navigateToAdmin,
    isAdmin,
    currentView
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategorySelect = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    navigateToHome();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#171717] text-white shadow-lg border-b border-[#262626]">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-[#FF681B] via-[#FF8A3D] to-[#FFD43B] text-[#171717] py-1.5 px-4 text-xs font-bold text-center tracking-wide flex items-center justify-center gap-2">
        <Flame className="w-4 h-4 animate-bounce" />
        <span>ACHADINHOS EXCLUSIVOS &bull; OFERTAS COM ATÉ 60% OFF &bull; CHECKOUT SEGURO KAIROSS</span>
        <Flame className="w-4 h-4 animate-bounce hidden sm:inline" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo e Slogan */}
          <div 
            onClick={navigateToHome}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF681B] to-[#FFD43B] flex items-center justify-center shadow-brand transform group-hover:scale-105 transition duration-200">
              <Flame className="w-7 h-7 text-[#171717] fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none text-white flex items-center gap-1.5">
                CONECT <span className="text-[#FF681B]">STORE</span>
                <span className="text-xs font-bold bg-[#FFD43B] text-[#171717] px-1.5 py-0.5 rounded-md uppercase tracking-wider ml-1">
                  OFERTAS
                </span>
              </span>
              <span className="text-xs text-gray-300 font-medium tracking-normal mt-0.5 group-hover:text-[#FFD43B] transition">
                Achou, gostou, aproveitou!
              </span>
            </div>
          </div>

          {/* Barra de Pesquisa Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (currentView !== 'home') navigateToHome();
                }}
                placeholder="Buscar achadinhos, novidades, ofertas..."
                className="w-full bg-[#262626] text-white placeholder-gray-400 pl-11 pr-10 py-2.5 rounded-full border border-gray-700 focus:outline-none focus:border-[#FF681B] focus:ring-2 focus:ring-[#FF681B]/30 transition text-sm shadow-inner"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Ações da Direita */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Selo de Garantia */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-gray-300 border border-gray-800 bg-[#222222] px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#FFD43B]" />
              <span>Checkout Oficial <strong>Kaiross</strong></span>
            </div>

            {/* Acesso Admin */}
            <button
              onClick={navigateToAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                currentView === 'admin'
                  ? 'bg-[#FF681B] text-white border-[#FF681B]'
                  : 'bg-[#222222] text-gray-300 hover:text-white hover:bg-[#2c2c2c] border-gray-700'
              }`}
              title="Painel Administrativo"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAdmin ? 'Painel Admin' : 'Admin'}</span>
            </button>

            {/* Botão Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white bg-[#222222] rounded-xl border border-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa Mobile */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (currentView !== 'home') navigateToHome();
              }}
              placeholder="Buscar ofertas e achadinhos..."
              className="w-full bg-[#262626] text-white placeholder-gray-400 pl-10 pr-9 py-2 rounded-full border border-gray-700 focus:outline-none focus:border-[#FF681B] text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Menu Desktop de Categorias Rápidas */}
        <nav className="hidden md:flex items-center justify-center gap-1 py-2.5 border-t border-[#262626] text-xs font-medium overflow-x-auto">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-[#FF681B] text-white font-bold shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#262626]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Todos os Produtos
          </button>
          {INITIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategorySelect(cat.nome)}
              className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
                selectedCategory === cat.nome
                  ? 'bg-[#FF681B] text-white font-bold shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-[#262626]'
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </nav>
      </div>

      {/* Gaveta do Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1f1f1f] border-t border-gray-800 px-4 py-4 space-y-3 animate-fadeIn">
          <p className="text-xs uppercase font-bold tracking-wider text-[#FFD43B]">
            Navegar por Categorias
          </p>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                selectedCategory === null ? 'bg-[#FF681B] text-white font-bold' : 'text-gray-300 hover:bg-[#282828]'
              }`}
            >
              <span>Todos os Achadinhos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {INITIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategorySelect(cat.nome)}
                className={`text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                  selectedCategory === cat.nome ? 'bg-[#FF681B] text-white font-bold' : 'text-gray-300 hover:bg-[#282828]'
                }`}
              >
                <span>{cat.nome}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
            <span>Ambiente Kaiross Verificado</span>
            <span className="text-[#FFD43B] font-bold">100% Confiável</span>
          </div>
        </div>
      )}
    </header>
  );
};
