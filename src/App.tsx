import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AdminPage } from './pages/AdminPage';
import { WhatsAppSupportButton } from './components/WhatsAppSupportButton';

const MainLayout: React.FC = () => {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-sans text-[#171717] selection:bg-[#FF681B] selection:text-white">
      {/* Header presente em todas as páginas */}
      <Header />

      {/* Conteúdo dinâmico de acordo com a rota ativa */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'admin' && <AdminPage />}
      </main>

      {/* Rodapé e Suporte Flutuante visíveis no ambiente público */}
      {currentView !== 'admin' && (
        <>
          <Footer />
          <WhatsAppSupportButton />
        </>
      )}
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}

export default App;
