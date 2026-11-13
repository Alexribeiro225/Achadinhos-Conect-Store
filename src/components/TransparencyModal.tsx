import React from 'react';
import { X, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface TransparencyModalProps {
  isOpen: boolean;
  topic: 'afiliados' | 'privacidade' | 'termos';
  onClose: () => void;
}

export const TransparencyModal: React.FC<TransparencyModalProps> = ({
  isOpen,
  topic,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-[#171717] hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {topic === 'afiliados' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#FF681B]">
              <div className="p-3 bg-[#FFF0E8] rounded-2xl">
                <ShieldAlert className="w-6 h-6 text-[#FF681B]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#171717]">
                Aviso Legal de Afiliado & Modelo Comercial
              </h3>
            </div>

            <div className="text-sm text-gray-600 space-y-3 leading-relaxed border-t border-gray-100 pt-4">
              <p>
                A <strong>CONECT STORE OFERTAS</strong> opera sob o modelo de curadoria e afiliação comercial em parceria com a plataforma <strong>Kaiross</strong>.
              </p>
              
              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-200">
                <h4 className="font-bold text-[#171717] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Como funcionam as compras:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>Nós não realizamos cobranças diretas e não temos acesso a dados de cartão de crédito.</li>
                  <li>Ao clicar em <strong>"COMPRAR AGORA"</strong>, você é redirecionado em nova aba para o ambiente oficial de checkout da Kaiross.</li>
                  <li>Todas as transações, emissão de nota fiscal, faturamento e logística de entrega são realizadas pela infraestrutura da Kaiross.</li>
                  <li>A CONECT STORE OFERTAS pode receber uma comissão financeira caso você conclua a compra, sem qualquer custo adicional no valor final do produto.</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 italic">
                * Estimativas de margem interna exibidas no painel administrativo são parâmetros operacionais da Kaiross e não constituem garantia de lucro nem promessa comercial para consumidores.
              </p>
            </div>
          </div>
        )}

        {topic === 'privacidade' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#FF681B]">
              <div className="p-3 bg-[#FFF0E8] rounded-2xl">
                <Lock className="w-6 h-6 text-[#FF681B]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#171717]">
                Política de Privacidade & LGPD
              </h3>
            </div>

            <div className="text-sm text-gray-600 space-y-3 leading-relaxed border-t border-gray-100 pt-4">
              <p>
                Sua privacidade é prioridade na <strong>CONECT STORE OFERTAS</strong>. Cumprimos integralmente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
              </p>
              <p>
                1. <strong>Coleta de Informações:</strong> Não coletamos nem armazenamos senhas bancárias ou dados financeiros sensíveis. Nosso site atua como vitrine estática e interativa de ofertas.
              </p>
              <p>
                2. <strong>Métricas de Navegação:</strong> Podemos registrar contadores anônimos de cliques em produtos para avaliar a relevância dos achadinhos e organizar as melhores recomendações.
              </p>
              <p>
                3. <strong>Ambiente de Pagamento:</strong> Os dados necessários para compra (nome, endereço e pagamento) são preenchidos e protegidos diretamente nos servidores seguros da Kaiross durante a finalização do pedido.
              </p>
            </div>
          </div>
        )}

        {topic === 'termos' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#FF681B]">
              <div className="p-3 bg-[#FFF0E8] rounded-2xl">
                <CheckCircle2 className="w-6 h-6 text-[#FF681B]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#171717]">
                Termos de Uso da Vitrine
              </h3>
            </div>

            <div className="text-sm text-gray-600 space-y-3 leading-relaxed border-t border-gray-100 pt-4">
              <p>
                Ao navegar no portal <strong>CONECT STORE OFERTAS</strong>, o visitante concorda com os seguintes termos:
              </p>
              <p>
                1. Os preços, disponibilidades e condições promocionais são gerenciados em tempo real pela plataforma Kaiross e pelos distribuidores participantes.
              </p>
              <p>
                2. Em caso de divergência de valores entre a nossa vitrine informativa e o checkout da Kaiross, prevalecerá sempre a condição exibida no momento da finalização do pedido na página oficial da Kaiross.
              </p>
              <p>
                3. A garantia legal de 7 dias para arrependimento e 90 dias contra defeitos de fabricação segue estritamente o Código de Defesa do Consumidor através dos canais de suporte oficiais.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#171717] hover:bg-[#262626] text-white font-bold text-xs rounded-xl transition"
          >
            Entendido e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
