import React from 'react';
import { Flame, Sparkles, TrendingUp, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

export const BannerHero: React.FC = () => {
  const scrollToOffers = () => {
    const el = document.getElementById('secao-achadinhos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#171717] via-[#221c17] to-[#171717] text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#2d251f]">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF681B]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#FFD43B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Conteúdo Principal */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF681B]/20 border border-[#FF681B]/40 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#FFD43B]">
              <Flame className="w-4 h-4 text-[#FF681B]" />
              <span>SELEÇÃO ESPECIAL V1.0 &bull; ACHOU, GOSTOU, APROVEITOU!</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Os melhores <span className="text-[#FF681B] underline decoration-[#FFD43B] decoration-wavy underline-offset-8">achadinhos</span> e ofertas úteis da internet.
            </h1>

            {/* Descrição */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 font-normal">
              Curadoria focada em produtos que resolvem o seu dia a dia. Encontre novidades em tecnologia, casa, beleza e acessórios com descontos reais e compra 100% segura pelo ambiente oficial <strong>Kaiross</strong>.
            </p>

            {/* Bullets de Confiança */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-gray-300">
              <span className="flex items-center gap-1.5 bg-[#262626]/80 px-3 py-1.5 rounded-lg border border-gray-700">
                <CheckCircle2 className="w-4 h-4 text-[#FFD43B]" />
                Produtos Úteis e Virais
              </span>
              <span className="flex items-center gap-1.5 bg-[#262626]/80 px-3 py-1.5 rounded-lg border border-gray-700">
                <ShieldCheck className="w-4 h-4 text-[#FF681B]" />
                Checkout Direto Kaiross
              </span>
              <span className="flex items-center gap-1.5 bg-[#262626]/80 px-3 py-1.5 rounded-lg border border-gray-700">
                <Zap className="w-4 h-4 text-[#FFD43B]" />
                Preços de Oportunidade
              </span>
            </div>

            {/* Botões de Ação */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={scrollToOffers}
                className="w-full sm:w-auto px-8 py-4 bg-[#FF681B] hover:bg-[#e6560e] text-white font-extrabold rounded-2xl shadow-brand hover:shadow-lg transform active:scale-95 transition flex items-center justify-center gap-2 text-base"
              >
                <Flame className="w-5 h-5 text-[#FFD43B]" />
                VER ACHADINHOS DO MOMENTO
              </button>
              <a
                href="#secao-ofertas"
                className="w-full sm:w-auto px-6 py-4 bg-[#262626] hover:bg-[#333333] text-white font-bold rounded-2xl border border-gray-700 hover:border-gray-500 transition flex items-center justify-center gap-2 text-base"
              >
                <TrendingUp className="w-5 h-5 text-[#FF681B]" />
                OFERTAS IMPERDÍVEIS
              </a>
            </div>
          </div>

          {/* Card Destaque / Visual Promocional */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-b from-[#2a2420] to-[#1c1815] border-2 border-[#FF681B]/40 rounded-3xl p-6 shadow-2xl">
              {/* Floating Pill */}
              <div className="absolute -top-3 right-6 bg-[#FFD43B] text-[#171717] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow">
                ⚡ OFERTAS ATIVAS
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#FF681B] rounded-2xl text-white">
                  <Sparkles className="w-6 h-6 text-[#FFD43B]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Curadoria Conect Store</h3>
                  <p className="text-xs text-gray-300">Sem pegadinhas, sem taxas escondidas</p>
                </div>
              </div>

              <div className="space-y-3 bg-[#171717]/80 rounded-2xl p-4 border border-gray-800">
                <div className="flex items-center justify-between text-sm py-1 border-b border-gray-800">
                  <span className="text-gray-300">Formato:</span>
                  <span className="font-semibold text-white">Vitrine Oficial de Ofertas</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1 border-b border-gray-800">
                  <span className="text-gray-300">Processamento de Pedidos:</span>
                  <span className="font-bold text-[#FFD43B]">Ambiente Seguro Kaiross</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1 border-b border-gray-800">
                  <span className="text-gray-300">Garantia ao Consumidor:</span>
                  <span className="font-semibold text-white">7 Dias conforme CDC</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-300">Status dos Preços:</span>
                  <span className="font-bold text-[#FF681B] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Valores Atualizados
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#FF681B]/10 rounded-xl border border-[#FF681B]/20 text-center text-xs text-[#FFD43B] font-medium">
                🎯 "Achou, gostou, aproveitou!" — Ofertas válidas enquanto durarem os estoques no checkout Kaiross.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
