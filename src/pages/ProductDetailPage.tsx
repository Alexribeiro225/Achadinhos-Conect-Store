import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  RotateCcw, 
  HelpCircle,
  Share2,
  Tag,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { activeProduct, activeProducts, navigateToHome, handleKairossCheckout } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!activeProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#171717] mb-2">Produto não encontrado</h2>
        <p className="text-gray-500 mb-6 text-sm">
          O produto que você procura pode ter sido pausado ou o link é inválido.
        </p>
        <button
          onClick={navigateToHome}
          className="px-6 py-2.5 bg-[#FF681B] text-white font-bold text-xs rounded-xl hover:bg-[#e6560e] transition"
        >
          Voltar para a Página Inicial
        </button>
      </div>
    );
  }

  const images = activeProduct.imagens && activeProduct.imagens.length > 0
    ? activeProduct.imagens
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'];

  const discountPercent =
    activeProduct.preco_anterior && activeProduct.preco_anterior > activeProduct.preco_venda
      ? Math.round(
          ((activeProduct.preco_anterior - activeProduct.preco_venda) /
            activeProduct.preco_anterior) *
            100
        )
      : null;

  const savingsAmount =
    activeProduct.preco_anterior && activeProduct.preco_anterior > activeProduct.preco_venda
      ? (activeProduct.preco_anterior - activeProduct.preco_venda).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      : null;

  const formattedSalePrice = activeProduct.preco_venda.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  const formattedOldPrice = activeProduct.preco_anterior
    ? activeProduct.preco_anterior.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    : null;

  // Produtos relacionados da mesma categoria ou outros achadinhos
  const relatedProducts = activeProducts
    .filter((p) => p.id !== activeProduct.id && (p.categoria === activeProduct.categoria || p.destaque))
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navegação Breadcrumbs */}
        <nav className="flex items-center justify-between mb-6 text-xs text-gray-500">
          <button
            onClick={navigateToHome}
            className="flex items-center gap-1.5 font-bold text-[#171717] hover:text-[#FF681B] transition bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para as Ofertas</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#FF681B] bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm transition"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Link copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Compartilhar oferta</span>
              </>
            )}
          </button>
        </nav>

        {/* Card Principal do Produto */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-4 sm:p-8 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* 1. Galeria de Imagens */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={images[selectedImageIndex] || images[0]}
                  alt={activeProduct.nome}
                  className="w-full h-full object-cover object-center"
                />

                {/* Badges Flutuantes */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {activeProduct.etiqueta_oferta && (
                    <span className="bg-[#FF681B] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {activeProduct.etiqueta_oferta}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="bg-[#FFD43B] text-[#171717] text-xs font-black px-3 py-1 rounded-full shadow">
                      -{discountPercent}% OFF REAL
                    </span>
                  )}
                </div>
              </div>

              {/* Miniaturas da Galeria */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-[#FF681B] ring-2 ring-[#FF681B]/20 scale-105'
                          : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${activeProduct.nome} miniatura ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Informação de Garantia e Entrega */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center">
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-[#FF681B] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#171717] block">Compra Segura</span>
                  <span className="text-[10px] text-gray-500">Checkout Kaiross</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-[#FF681B] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#171717] block">Garantia 7 Dias</span>
                  <span className="text-[10px] text-gray-500">Direito do Consumidor</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <Truck className="w-5 h-5 text-[#FF681B] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#171717] block">Envio com Rastreio</span>
                  <span className="text-[10px] text-gray-500">Código por e-mail</span>
                </div>
              </div>
            </div>

            {/* 2. Informações, Preços e Botão de Ação */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Categoria */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF681B] bg-[#FFF0E8] px-3 py-1 rounded-full">
                    {activeProduct.categoria}
                  </span>
                  <span className="text-xs text-gray-400">&bull; Código: {activeProduct.id}</span>
                </div>

                {/* Nome do Produto */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] leading-snug">
                  {activeProduct.nome}
                </h1>

                {/* Descrição Curta */}
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {activeProduct.descricao_curta}
                </p>

                {/* Bloco de Preços e Economia */}
                <div className="p-5 bg-gradient-to-br from-gray-50 to-orange-50/40 rounded-2xl border border-gray-200 space-y-2">
                  {formattedOldPrice && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>De:</span>
                      <span className="line-through">{formattedOldPrice}</span>
                      {savingsAmount && (
                        <span className="text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded">
                          Você economiza {savingsAmount}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-gray-600">Por apenas:</span>
                    <span className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
                      {formattedSalePrice}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 font-medium">
                    Pagamento facilitado em até 12x no cartão ou à vista via Pix diretamente no checkout oficial.
                  </p>
                </div>

                {/* Botão de Compra em Destaque */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleKairossCheckout(activeProduct)}
                    className="w-full py-4 px-6 bg-[#FF681B] hover:bg-[#e6560e] text-white font-black text-base sm:text-lg rounded-2xl shadow-brand hover:shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-3 animate-pulse-subtle"
                  >
                    <span>COMPRAR AGORA NO CHECKOUT KAIROSS</span>
                    <ExternalLink className="w-5 h-5 text-[#FFD43B]" />
                  </button>

                  <div className="p-3 bg-[#222222] text-white rounded-xl text-center text-xs flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FFD43B]" />
                    <span>Transação 100% segura e criptografada no ambiente oficial <strong>Kaiross</strong>.</span>
                  </div>
                </div>

                {/* Benefícios Principais */}
                {activeProduct.beneficios && activeProduct.beneficios.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                      Por que você vai amar este produto:
                    </h3>
                    <ul className="space-y-2">
                      {activeProduct.beneficios.map((beneficio, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Aviso Transparente de Afiliado do Produto */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-500 leading-relaxed flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso de transparência:</strong> Somos uma vitrine de ofertas. Ao clicar em comprar, você será direcionado para o ambiente seguro da plataforma <strong>Kaiross</strong> para pagamento e entrega.
                </span>
              </div>
            </div>

          </div>

          {/* Seção Inferior: Descrição Completa e Especificações Técnicas */}
          <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Descrição Detalhada */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-extrabold text-[#171717] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#FF681B]" />
                <span>Descrição Completa do Produto</span>
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed space-y-3 whitespace-pre-line">
                {activeProduct.descricao_completa}
              </div>
            </div>

            {/* Especificações Técnicas */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-xl font-extrabold text-[#171717] flex items-center gap-2">
                <span>Especificações Técnicas</span>
              </h2>
              {activeProduct.especificacoes && activeProduct.especificacoes.length > 0 ? (
                <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-200 text-xs sm:text-sm">
                  {activeProduct.especificacoes.map((spec, idx) => (
                    <div key={idx} className="flex justify-between p-3.5">
                      <span className="font-semibold text-gray-500">{spec.chave}</span>
                      <span className="font-bold text-[#171717] text-right">{spec.valor}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Especificações gerais fornecidas pelo fabricante no ambiente Kaiross.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#FF681B] uppercase tracking-wider">
                Você também pode gostar
              </span>
              <h2 className="text-2xl font-extrabold text-[#171717]">
                Produtos Relacionados e Achadinhos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
