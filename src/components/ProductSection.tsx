import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
  products: Product[];
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  id,
  title,
  subtitle,
  badgeText,
  icon,
  products
}) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-24">
      {/* Header da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-gray-200 gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {badgeText && (
              <span className="bg-[#FF681B]/10 text-[#FF681B] text-xs font-black uppercase px-2.5 py-0.5 rounded-md border border-[#FF681B]/20">
                {badgeText}
              </span>
            )}
            <span className="text-xs font-medium text-gray-500">
              {products.length} {products.length === 1 ? 'oferta' : 'ofertas selecionadas'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 font-normal">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Grid de Cards de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
