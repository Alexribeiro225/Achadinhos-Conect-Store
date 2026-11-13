import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppSupportButton: React.FC = () => {
  const whatsappNumber = '5511987654321';
  const defaultMessage = encodeURIComponent(
    'Olá! Estava navegando na Conect Store Ofertas e gostaria de tirar uma dúvida sobre um produto.'
  );

  return (
    <aside aria-label="Suporte WhatsApp" className="contents">
      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center gap-2 transform hover:scale-110 active:scale-95 transition-all duration-200 group"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-1">
          Dúvidas? Fale no WhatsApp
        </span>
      </a>
    </aside>
  );
};
