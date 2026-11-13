export type ProductCategory = 
  | 'Beleza e cuidados pessoais'
  | 'Casa e cozinha'
  | 'Tecnologia e eletrônicos'
  | 'Automotivos'
  | 'Acessórios e utilidades';

export type ProductStatus = 'ativo' | 'pausado';

export type ProductHighlightSection = 'achadinhos' | 'ofertas' | 'populares' | 'geral';

export interface ProductSpecification {
  chave: string;
  valor: string;
}

export interface Product {
  id: string;
  nome: string;
  slug: string;
  descricao_curta: string;
  descricao_completa: string;
  categoria: ProductCategory | string;
  imagens: string[];
  preco_custo: number;
  preco_venda: number;
  preco_anterior?: number | null; // Apenas quando houver desconto real comprovado
  margem_estimada: number; // Margem líquida estimada pela Kaiross (estimativa administrativa informada)
  link_checkout_kaiross: string;
  status: ProductStatus;
  destaque: boolean;
  secao_destaque: ProductHighlightSection;
  ordem: number;
  etiqueta_oferta?: string; // Ex: 'OFERTA IMPERDÍVEL', 'ACHADINHO', '35% OFF', 'FRETE FACILITADO'
  especificacoes: ProductSpecification[];
  beneficios: string[];
  cliques?: number; // Contagem real de cliques agregada da tabela click_events
  created_at?: string;
  updated_at?: string;
}

export interface ClickEvent {
  id: string;
  product_id: string;
  clicked_at: string;
  source: string;
}

export interface AdminUser {
  user_id: string;
  created_at: string;
}

export interface AdminStats {
  totalProdutos: number;
  produtosAtivos: number;
  produtosPausados: number;
  totalCliques: number; // Total real de cliques
  margemMediaEstimada: number;
}

export interface CategoryInfo {
  nome: ProductCategory;
  slug: string;
  icone: string;
  descricao: string;
}
