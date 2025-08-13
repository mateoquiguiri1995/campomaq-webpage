import { Product, ProductsResponse, SearchFilters } from '../types';

// Configuración base para la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Cliente HTTP básico
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Instancia del cliente API
const apiClient = new ApiClient(API_BASE_URL);

// Servicio de productos
export class ProductService {
  // Obtener todos los productos con filtros opcionales
  static async getProducts(filters?: SearchFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.query) params.append('q', filters.query);
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.priceRange) {
        params.append('minPrice', filters.priceRange.min.toString());
        params.append('maxPrice', filters.priceRange.max.toString());
      }
      if (filters.tags?.length) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }
      if (filters.inStockOnly) params.append('inStock', 'true');
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
    }

    const endpoint = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    return apiClient.get<ProductsResponse>(endpoint);
  }

  // Obtener un producto por ID
  static async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  }

  // Buscar productos
  static async searchProducts(query: string, filters?: Omit<SearchFilters, 'query'>): Promise<ProductsResponse> {
    return this.getProducts({ query, ...filters });
  }

  // Obtener productos por categoría
  static async getProductsByCategory(category: string, filters?: Omit<SearchFilters, 'category'>): Promise<ProductsResponse> {
    return this.getProducts({ category, ...filters });
  }

  // Obtener productos por marca
  static async getProductsByBrand(brand: string, filters?: Omit<SearchFilters, 'brand'>): Promise<ProductsResponse> {
    return this.getProducts({ brand, ...filters });
  }

  // Obtener productos en oferta
  static async getProductsOnSale(filters?: Omit<SearchFilters, 'query'>): Promise<ProductsResponse> {
    return apiClient.get<ProductsResponse>('/products/sale');
  }

  // Obtener productos nuevos
  static async getNewProducts(filters?: Omit<SearchFilters, 'query'>): Promise<ProductsResponse> {
    return apiClient.get<ProductsResponse>('/products/new');
  }

  // Obtener productos en tendencia
  static async getTrendingProducts(filters?: Omit<SearchFilters, 'query'>): Promise<ProductsResponse> {
    return apiClient.get<ProductsResponse>('/products/trending');
  }

  // Obtener productos relacionados
  static async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/${productId}/related?limit=${limit}`);
  }

  // Obtener categorías disponibles
  static async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/categories');
  }

  // Obtener marcas disponibles
  static async getBrands(): Promise<string[]> {
    return apiClient.get<string[]>('/brands');
  }

  // Obtener filtros disponibles
  static async getAvailableFilters(): Promise<{
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
  }> {
    return apiClient.get('/filters');
  }
}

// Hook personalizado para usar el servicio de productos
export const useProductService = () => {
  return {
    getProducts: ProductService.getProducts,
    getProductById: ProductService.getProductById,
    searchProducts: ProductService.searchProducts,
    getProductsByCategory: ProductService.getProductsByCategory,
    getProductsByBrand: ProductService.getProductsByBrand,
    getProductsOnSale: ProductService.getProductsOnSale,
    getNewProducts: ProductService.getNewProducts,
    getTrendingProducts: ProductService.getTrendingProducts,
    getRelatedProducts: ProductService.getRelatedProducts,
    getCategories: ProductService.getCategories,
    getBrands: ProductService.getBrands,
    getAvailableFilters: ProductService.getAvailableFilters,
  };
};

// Función de fallback para cuando la API no esté disponible
export const getFallbackProducts = (): Product[] => {
  // Importar productos locales como fallback
  const { products } = require('../data/products');
  return products;
};

// Función para manejar errores de API y usar datos locales como fallback
export const handleApiError = (error: any, fallbackData: any) => {
  console.warn('API error, using fallback data:', error);
  return fallbackData;
};
