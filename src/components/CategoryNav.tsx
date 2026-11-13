import React from 'react';
import { Sparkles, Utensils, Cpu, Car, PackageCheck, LayoutGrid } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../data/initialProducts';
import { useStore } from '../context/StoreContext';

export const CategoryNav: React.FC = () => {
  const { selectedCategory, setSelectedCategory, activeProducts } = useStore();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Car':
        return <Car className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'PackageCheck':
      default:
        return <PackageCheck className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const getCategoryCount = (categoryName: string) => {
    return activeProducts.filter((p) => p.categoria === categoryName).length;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight">
            Categorias em Destaque
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Filtre os achadinhos por segmento e encontre o que precisa
          </p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-bold text-[#FF681B] hover:underline"
          >
            Limpar filtro ({selectedCategory})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {/* Card "Todos" */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center group cursor-pointer ${
            selectedCategory === null
              ? 'bg-[#FF681B] text-white border-[#FF681B] shadow-brand scale-[1.02]'
              : 'bg-white text-[#171717] border-gray-200 hover:border-[#FF681B] hover:shadow-card'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition ${
              selectedCategory === null
                ? 'bg-[#171717] text-[#FFD43B]'
                : 'bg-[#F5F5F5] text-[#FF681B] group-hover:bg-[#FFF0E8]'
            }`}
          >
            <LayoutGrid className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs sm:text-sm leading-tight">Todos</span>
          <span
            className={`text-[11px] mt-1 font-medium ${
              selectedCategory === null ? 'text-white/80' : 'text-gray-400'
            }`}
          >
            {activeProducts.length} itens
          </span>
        </button>

        {/* Categorias Mapeadas */}
        {INITIAL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.nome;
          const count = getCategoryCount(cat.nome);

          return (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.nome)}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all text-center group cursor-pointer ${
                isSelected
                  ? 'bg-[#FF681B] text-white border-[#FF681B] shadow-brand scale-[1.02]'
                  : 'bg-white text-[#171717] border-gray-200 hover:border-[#FF681B] hover:shadow-card'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition ${
                  isSelected
                    ? 'bg-[#171717] text-[#FFD43B]'
                    : 'bg-[#F5F5F5] text-[#FF681B] group-hover:bg-[#FFF0E8]'
                }`}
              >
                {getCategoryIcon(cat.icone)}
              </div>
              <span className="font-bold text-xs sm:text-sm leading-tight line-clamp-2">
                {cat.nome}
              </span>
              <span
                className={`text-[11px] mt-1 font-medium ${
                  isSelected ? 'text-white/80' : 'text-gray-400'
                }`}
              >
                {count} {count === 1 ? 'item' : 'itens'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
