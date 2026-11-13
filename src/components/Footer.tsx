import React, { useState } from 'react';
import { Flame, ShieldCheck, Mail, MessageCircle, ExternalLink, HelpCircle, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { TransparencyModal } from './TransparencyModal';

export const Footer: React.FC = () => {
  const { navigateToAdmin } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTopic, setModalTopic] = useState<'afiliados' | 'privacidade' | 'termos'>('afiliados');

  const openModal = (topic: 'afiliados' | 'privacidade' | 'termos') => {
    setModalTopic(topic);
    setModalOpen(true);
  };

  return (
    <>
      <footer className="bg-[#171717] text-white pt-12 pb-8 border-t border-[#262626] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Caixa de Aviso Transparente de Afiliado */}
          <div className="mb-10 p-5 rounded-2xl bg-[#222222] border border-[#333333] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#FF681B]/20 rounded-xl text-[#FF681B] mt-0.5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Aviso de Transparência e Isenção de Responsabilidade Comercial</span>
                  <span className="text-[10px] bg-[#FFD43B] text-[#171717] px-2 py-0.5 rounded font-black uppercase">
                    Transparência
                  </span>
                </h4>
                <p className="text-xs text-gray-400 max-w-3xl leading-relaxed">
                  A <strong>CONECT STORE OFERTAS</strong> atua como vitrine de curadoria e divulgação de ofertas e achadinhos. Alguns links direcionam para a plataforma <strong>Kaiross</strong>, onde a loja pode receber comissão por vendas qualificadas sem nenhum custo adicional para o comprador. Os pedidos, pagamentos, emissão fiscal e entregas são processados exclusivamente no ambiente Kaiross.
                </p>
              </div>
            </div>

            <button
              onClick={() => openModal('afiliados')}
              className="text-xs font-bold text-[#FFD43B] hover:text-white underline whitespace-nowrap"
            >
              Saiba como funciona
            </button>
          </div>

          {/* Grid Principal do Rodapé */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#262626]">
            
            {/* Coluna 1: Marca & Slogan */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF681B] to-[#FFD43B] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#171717]" />
                </div>
                <span className="text-lg font-extrabold tracking-tight">
                  CONECT <span className="text-[#FF681B]">STORE</span>
                </span>
              </div>
              <p className="text-sm text-[#FFD43B] font-semibold">
                "Achou, gostou, aproveitou!"
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Curadoria de produtos úteis, soluções inovadoras e ofertas imperdíveis para facilitar a sua rotina com total praticidade.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Navegação Criptografada SSL 256-Bit</span>
              </div>
            </div>

            {/* Coluna 2: Atendimento e Suporte */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Canais de Atendimento
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#FF681B]" />
                  <span>WhatsApp: (11) 98765-4321</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FF681B]" />
                  <span>contato@conectstoreofertas.com</span>
                </li>
                <li className="text-gray-400 pt-1">
                  Atendimento de Segunda a Sexta, das 09h às 18h.
                </li>
              </ul>
            </div>

            {/* Coluna 3: Links e Transparência */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Institucional & Segurança
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>
                  <button
                    onClick={() => openModal('afiliados')}
                    className="hover:text-[#FF681B] transition flex items-center gap-1"
                  >
                    <span>Política de Afiliados e Parcerias</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('privacidade')}
                    className="hover:text-[#FF681B] transition flex items-center gap-1"
                  >
                    <span>Política de Privacidade (LGPD)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('termos')}
                    className="hover:text-[#FF681B] transition flex items-center gap-1"
                  >
                    <span>Termos de Uso e Isenção</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={navigateToAdmin}
                    className="hover:text-[#FFD43B] transition flex items-center gap-1 text-gray-400"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Acesso Administrativo</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Coluna 4: Redes Sociais & Conectividade */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Siga as Novidades
              </h4>
              <p className="text-xs text-gray-400">
                Acompanhe os novos achadinhos diariamente nas nossas redes:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#262626] hover:bg-[#FF681B] rounded-lg text-xs font-semibold text-gray-200 hover:text-white transition"
                >
                  Instagram
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#262626] hover:bg-[#FF681B] rounded-lg text-xs font-semibold text-gray-200 hover:text-white transition"
                >
                  TikTok
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#262626] hover:bg-[#FF681B] rounded-lg text-xs font-semibold text-gray-200 hover:text-white transition"
                >
                  YouTube
                </a>
              </div>
            </div>

          </div>

          {/* Linha Final de Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-300 gap-4">
            <p>
              &copy; {new Date().getFullYear()} <strong>CONECT STORE OFERTAS</strong>. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-3">
              <span>Checkout Oficial: <strong>Kaiross</strong></span>
              <span>&bull;</span>
              <span>Pronta para Lovable e Domínio Próprio</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Modal de Transparência */}
      <TransparencyModal
        isOpen={modalOpen}
        topic={modalTopic}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};
