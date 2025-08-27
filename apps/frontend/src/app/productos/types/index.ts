// Tipos para productos y filtros
export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  brand?: string;
  brandLogo?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;

  /** Descripción completa proveniente de la API (puede contener detalles, especificaciones, recomendaciones, etc.) */
  description: string;

  /** Galería de imágenes adicionales */
  additionalImages?: string[];

  /** Etiquetas libres para búsquedas o filtros */
  tags?: string[];
}


export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface FilterState {
  searchQuery: string;
  showSearchResults: boolean;
  activeTab: string;
  selectedCategory: string;
  selectedBrand: string;
  sortBy: string;
  showPriceFilters: boolean;
  showBrandFilters: boolean;
  selectedTags?: string[];
}

export interface SearchFilters {
  query: string;
  category?: string;
  brand?: string;
  tags?: string[];
  sortBy?: string;
  page?: number;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductsResponse extends ApiResponse<Product[]> {
  filters?: {
    categories: string[];
    brands: string[];
  };
}

// Tipos para breadcrumbs
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Tipos para componentes de UI
export interface CardProductoProps {
  id: string;
  name: string;
  image: string;
  category: string;
  brand?: string;
  brandLogo?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  onClick?: () => void;
}