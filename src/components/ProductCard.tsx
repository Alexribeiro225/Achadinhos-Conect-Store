import React from 'react';
import { ExternalLink, Tag, ShieldCheck, Eye } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateToProduct, handleKairossCheckout } = useStore();

  const discountPercent =
    product.preco_anterior && product.preco_anterior > product.preco_venda
      ? Math.round(
          ((product.preco_anterior - product.preco_venda) / product.preco_anterior) * 100
        )
      : null;

  const formattedSalePrice = product.preco_venda.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  const formattedOldPrice = product.preco_anterior
    ? product.preco_anterior.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    : null;

  const handleCardClick = () => {
    navigateToProduct(product.slug);
  };

  const onBuyButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Não dispara a navegação para a página de detalhes
    handleKairossCheckout(product);
  };

  const mainImage =
    product.imagens && product.imagens.length > 0
      ? product.imagens[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-3xl border border-gray-200 hover:border-[#FF681B] shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={product.nome}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Overlay hover quick view button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-[#171717] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5 text-[#FF681B]" />
            Ver Detalhes
          </span>
        </div>

        {/* Badges Flutuantes */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.etiqueta_oferta && (
            <span className="bg-[#FF681B] text-white text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#FFD43B]" />
              {product.etiqueta_oferta}
            </span>
          )}
          {discountPercent && (
            <span className="bg-[#FFD43B] text-[#171717] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Selo Categoria Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-[#171717]/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
            {product.categoria}
          </span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Categoria texto */}
          <p className="text-[11px] font-semibold text-[#FF681B] uppercase tracking-wider mb-1">
            {product.categoria}
          </p>

          {/* Nome do Produto */}
          <h3 className="font-bold text-sm sm:text-base text-[#171717] group-hover:text-[#FF681B] transition-colors line-clamp-2 leading-snug">
            {product.nome}
          </h3>

          {/* Descrição Curta */}
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.descricao_curta}
          </p>
        </div>

        {/* Bloco de Preço */}
        <div className="pt-2 border-t border-gray-100">
          {formattedOldPrice && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 line-through">
                {formattedOldPrice}
              </span>
              <span className="text-[11px] font-bold text-green-700 bg-green-50 px-1.5 py-0.2 rounded">
                Economia real
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-bold text-gray-500">Por</span>
            <span className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              {formattedSalePrice}
            </span>
          </div>
          <span className="text-[11px] text-gray-500 block">
            em até 12x no checkout
          </span>
        </div>

        {/* Botão de Compra Kaiross */}
        <div className="space-y-1.5 pt-1">
          <button
            type="button"
            onClick={onBuyButtonClick}
            className="w-full py-3 px-4 bg-[#FF681B] hover:bg-[#e6560e] text-white font-black text-xs sm:text-sm rounded-2xl shadow-brand hover:shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>COMPRAR AGORA</span>
            <ExternalLink className="w-4 h-4 text-[#FFD43B]" />
          </button>
          
          <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
            <ShieldCheck className="w-3 h-3 text-[#FF681B]" />
            <span>Checkout oficial <strong>Kaiross</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
