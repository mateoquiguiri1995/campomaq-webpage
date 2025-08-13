// Tipos para productos y filtros
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand?: string;
  brandLogo?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  description?: string;
  specifications?: Record<string, any>;
  stock?: number;
  sku?: string;
  // Campos adicionales para futuras integraciones con API
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  images?: string[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  rating?: number;
  reviewCount?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
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
  // Campos adicionales para filtros avanzados
  priceRange?: {
    min: number;
    max: number;
  };
  selectedTags?: string[];
  inStockOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchFilters {
  query: string;
  category?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  inStockOnly?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
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
    priceRange: {
      min: number;
      max: number;
    };
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
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand?: string;
  brandLogo?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  onClick?: () => void;
}
