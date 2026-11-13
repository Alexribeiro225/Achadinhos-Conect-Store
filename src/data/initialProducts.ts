import { Product, CategoryInfo } from '../types';

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  {
    nome: 'Beleza e cuidados pessoais',
    slug: 'beleza-e-cuidados-pessoais',
    icone: 'Sparkles',
    descricao: 'Itens essenciais de autocuidado, skincare e estética prática'
  },
  {
    nome: 'Casa e cozinha',
    slug: 'casa-e-cozinha',
    icone: 'Utensils',
    descricao: 'Utensílios inteligentes e organizadores que facilitam sua rotina'
  },
  {
    nome: 'Tecnologia e eletrônicos',
    slug: 'tecnologia-e-eletronicos',
    icone: 'Cpu',
    descricao: 'Gadgets inovadores, acessórios para celular e soluções portáteis'
  },
  {
    nome: 'Automotivos',
    slug: 'automotivos',
    icone: 'Car',
    descricao: 'Acessórios práticos para cuidado, limpeza e conforto no veículo'
  },
  {
    nome: 'Acessórios e utilidades',
    slug: 'acessorios-e-utilidades',
    icone: 'PackageCheck',
    descricao: 'Novidades e achadinhos multifuncionais para o seu dia a dia'
  }
];

// Dados iniciais com status 'pausado' para conferência e validação antes da publicação pública (Regra comercial 10)
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    nome: 'Mini Processador e Triturador Elétrico Recarregável USB 250ml',
    slug: 'mini-processador-triturador-eletrico-usb',
    descricao_curta: 'Triture alho, cebola, temperos e legumes em segundos com apenas 1 clique.',
    descricao_completa: 'O Mini Processador Elétrico Portátil é o achadinho indispensável para a sua cozinha. Com lâminas afiadas em aço inoxidável e acionamento por botão touch, ele tritura temperos, alho, castanhas e vegetais em menos de 10 segundos. Recarregável via USB com bateria de longa duração e corpo lavável impermeável IPX6.',
    categoria: 'Casa e cozinha',
    imagens: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    preco_custo: 22.50,
    preco_venda: 49.90,
    preco_anterior: 79.90,
    margem_estimada: 27.40,
    link_checkout_kaiross: 'https://kaiross.com/checkout/mini-processador-eletrico-usb?ref=conectstore',
    status: 'pausado', // Em demonstração/pausado até conferência de estoque e link pelo administrador
    destaque: true,
    secao_destaque: 'achadinhos',
    ordem: 1,
    etiqueta_oferta: 'ACHADINHO VIRAL',
    especificacoes: [
      { chave: 'Capacidade', valor: '250ml' },
      { chave: 'Alimentação', valor: 'Bateria USB 1200mAh Recarregável' },
      { chave: 'Material das Lâminas', valor: 'Aço Inox 304 Triplo' }
    ],
    beneficios: [
      'Economiza tempo no preparo de refeições diárias',
      'Fácil de desmontar e higienizar embaixo da torneira',
      'Lâminas triplas reforçadas que não enferrujam'
    ],
    cliques: 0,
    created_at: '2026-10-15T14:30:00Z',
    updated_at: '2026-10-15T14:30:00Z'
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    nome: 'Luminária Sensor de Movimento LED Slim Magnética Recarregável',
    slug: 'luminaria-sensor-movimento-led-slim',
    descricao_curta: 'Iluminação inteligente e automática para armários, escadas e guarda-roupas.',
    descricao_completa: 'Tenha iluminação suave e prática sem quebrar paredes ou passar fios. Esta fita luminária magnética com sensor de presença infravermelho detecta movimentos a até 3 metros e acende automaticamente. Ideal para closets, bancadas de cozinha, gavetas e corredores.',
    categoria: 'Casa e cozinha',
    imagens: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'
    ],
    preco_custo: 18.00,
    preco_venda: 39.90,
    preco_anterior: 59.90,
    margem_estimada: 21.90,
    link_checkout_kaiross: 'https://kaiross.com/checkout/luminaria-sensor-led-slim?ref=conectstore',
    status: 'pausado',
    destaque: true,
    secao_destaque: 'achadinhos',
    ordem: 2,
    etiqueta_oferta: 'SUPER PRÁTICO',
    especificacoes: [
      { chave: 'Comprimento', valor: '30 cm' },
      { chave: 'Fixação', valor: 'Magnética com fita 3M inclusa' }
    ],
    beneficios: [
      'Instalação rápida sem ferramentas',
      'Economia de energia com desligamento automático em 20s'
    ],
    cliques: 0,
    created_at: '2026-10-18T11:20:00Z',
    updated_at: '2026-10-18T11:20:00Z'
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    nome: 'Aspirador de Pó Portátil Automotivo e Doméstico Sem Fio 120W Turbo',
    slug: 'aspirador-portatil-automotivo-sem-fio-turbo',
    descricao_curta: 'Potência surpreendente de sucção para limpar o carro, teclado, sofás e cantos difíceis.',
    descricao_completa: 'Mantenha seu automóvel e seu ambiente impecáveis com o aspirador de pó sem fio de alta sucção. Equipado com motor ciclônico de 120W e filtro HEPA lavável que retém 99,9% dos ácaros e impurezas.',
    categoria: 'Automotivos',
    imagens: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80'
    ],
    preco_custo: 38.00,
    preco_venda: 79.90,
    preco_anterior: 129.90,
    margem_estimada: 41.90,
    link_checkout_kaiross: 'https://kaiross.com/checkout/aspirador-portatil-turbo-sem-fio?ref=conectstore',
    status: 'pausado',
    destaque: true,
    secao_destaque: 'ofertas',
    ordem: 3,
    etiqueta_oferta: '38% OFF REAL',
    especificacoes: [
      { chave: 'Potência', valor: '120W com sucção de 9000Pa' },
      { chave: 'Filtro', valor: 'HEPA Lavável' }
    ],
    beneficios: [
      'Limpeza profunda de estofados e cantos',
      'Portátil e sem fios'
    ],
    cliques: 0,
    created_at: '2026-10-20T09:15:00Z',
    updated_at: '2026-10-20T09:15:00Z'
  },
  {
    id: '44444444-4444-4444-a444-444444444444',
    nome: 'Fone de Ouvido Bluetooth Sem Fio TWS com Case Display LED de Bateria',
    slug: 'fone-ouvido-bluetooth-tws-display-led',
    descricao_curta: 'Som estéreo imersivo, redução de ruído e estojo com mostrador de carga digital.',
    descricao_completa: 'Liberdade total com áudio de alta definição. O fone Bluetooth TWS entrega graves potentes, pareamento instantâneo via Bluetooth 5.3 e comandos sensíveis ao toque. O estojo compacto possui display numérico.',
    categoria: 'Tecnologia e eletrônicos',
    imagens: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    ],
    preco_custo: 26.00,
    preco_venda: 59.90,
    preco_anterior: 99.90,
    margem_estimada: 33.90,
    link_checkout_kaiross: 'https://kaiross.com/checkout/fone-bluetooth-tws-led?ref=conectstore',
    status: 'pausado',
    destaque: true,
    secao_destaque: 'populares',
    ordem: 4,
    etiqueta_oferta: 'CAMPEÃO DE VENDAS',
    especificacoes: [
      { chave: 'Versão Bluetooth', valor: '5.3 de baixa latência' },
      { chave: 'Autonomia', valor: '5 a 6 horas por recarga' }
    ],
    beneficios: [
      'Conexão estável em Android e iOS',
      'Display digital de bateria'
    ],
    cliques: 0,
    created_at: '2026-10-22T16:45:00Z',
    updated_at: '2026-10-22T16:45:00Z'
  }
];
