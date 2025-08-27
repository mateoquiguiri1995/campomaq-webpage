import { Product, ProductsResponse, SearchFilters } from '../types';
import {products} from '../data/products'; // Importación ES6 en lugar de require

// Configuración base para la API
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://campomaq.azurewebsites.net/search';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

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
      // Check if it's a network error (failed to fetch)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Could not connect to the server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
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
  // Obtener todos los productos usando el endpoint /search solo si hay query, sino usar datos locales
  static async getProducts(filters?: SearchFilters): Promise<ProductsResponse> {
    // Si no hay query, usar datos locales directamente para evitar llamar a la API con query vacío
    if (!filters?.query) {
      return {
        data: getFallbackProducts(),
        success: false,
        message: 'No query provided, using local data'
      };
    }

    const params = new URLSearchParams();
    params.append('q', filters.query);
    
    const endpoint = `/search?${params.toString()}`;
    try {
      const productsArray = await apiClient.get<Product[]>(endpoint);
      return {
        data: productsArray,
        success: true,
      };
    } catch (error) {
      console.error('Error getting products via API:', error);
      // Fallback to local data
      return {
        data: getFallbackProducts(),
        success: false,
        message: 'API not available, using local data'
      };
    }
  }

  // Obtener un producto por ID
  static async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  }

  // Buscar productos usando el endpoint Flask
  static async searchProducts(query: string, filters?: Omit<SearchFilters, 'query'>): Promise<Product[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    // Eliminar otros filtros ya que el backend solo soporta 'q'
    // Los filtros adicionales se manejarán en el frontend si es necesario

    const endpoint = `/search?${params.toString()}`;
    try {
      const apiProducts = await apiClient.get<any[]>(endpoint);
      // Mapear la respuesta de la API al formato Product
      const products = apiProducts.map(apiProduct => this.mapApiProductToProduct(apiProduct));
      return products;
    } catch (error) {
      console.error('Error searching products via API:', error);
      // Fallback to local data using the existing getProducts which returns ProductsResponse
      const fallbackResponse = await this.getProducts({ query });
      return fallbackResponse.data;
    }
  }

  // Mapear producto de API a formato local
  private static mapApiProductToProduct(apiProduct: any): Product {
    return {
      id: apiProduct.id || `api-${Math.random().toString(36).substr(2, 9)}`,
      name: apiProduct.product_name?.trim() || 'Producto sin nombre',
      image: (apiProduct.link && Array.isArray(apiProduct.link) && apiProduct.link.length > 0)
        ? apiProduct.link[0]
        : '/images/placeholder.jpg',
      category: apiProduct.category_name?.trim() || 'Sin categoría',
      brand: apiProduct.brand_name?.trim() || 'Sin marca',
      brandLogo: apiProduct.brand_logo || '/images/brands/placeholder.png',
      isNew: apiProduct.is_new || false,
      isOnSale: apiProduct.is_on_sale || false,
      discount: apiProduct.discount || 0,
      description: apiProduct.description || 'Sin descripción',
      tags: apiProduct.tags || [],
      additionalImages: Array.isArray(apiProduct.link) ? apiProduct.link : []
    };
  }


  // Obtener productos en oferta - usar datos locales como fallback
  static async getProductsOnSale(): Promise<ProductsResponse> {
    try {
      const allProducts = await this.getProducts();
      const saleProducts = allProducts.data.filter(product => product.isOnSale);
      return {
        data: saleProducts,
        success: true,
      };
    } catch (error) {
      console.error('Error getting sale products:', error);
      return {
        data: getFallbackProducts().filter(product => product.isOnSale),
        success: false,
        message: 'API not available, using local data'
      };
    }
  }

  // Obtener productos nuevos - usar datos locales como fallback
  static async getNewProducts(): Promise<ProductsResponse> {
    try {
      const allProducts = await this.getProducts();
      const newProducts = allProducts.data.filter(product => product.isNew);
      return {
        data: newProducts,
        success: true,
      };
    } catch (error) {
      console.error('Error getting new products:', error);
      return {
        data: getFallbackProducts().filter(product => product.isNew),
        success: false,
        message: 'API not available, using local data'
      };
    }
  }

  // Obtener productos en tendencia - usar datos locales como fallback
  static async getTrendingProducts(): Promise<ProductsResponse> {
    try {
      const allProducts = await this.getProducts();
      const trendingIds = ["3", "5", "7", "9", "11", "12"];
      const trendingProducts = allProducts.data.filter(p => trendingIds.includes(p.id));
      return {
        data: trendingProducts,
        success: true,
      };
    } catch (error) {
      console.error('Error getting trending products:', error);
      const trendingIds = ["3", "5", "7", "9", "11", "12"];
      return {
        data: getFallbackProducts().filter(p => trendingIds.includes(p.id)),
        success: false,
        message: 'API not available, using local data'
      };
    }
  }

  // Obtener productos relacionados - usar datos locales como fallback
  static async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      const allProducts = await this.getProducts();
      const product = allProducts.data.find(p => p.id === productId);
      if (!product) return [];
      
      return allProducts.data
        .filter(p => p.id !== productId &&
                   (p.category === product.category || p.brand === product.brand))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting related products:', error);
      const product = getFallbackProducts().find(p => p.id === productId);
      if (!product) return [];
      
      return getFallbackProducts()
        .filter(p => p.id !== productId &&
                   (p.category === product.category || p.brand === product.brand))
        .slice(0, limit);
    }
  }

  // Obtener categorías disponibles - usar datos locales como fallback
  static async getCategories(): Promise<string[]> {
    try {
      const allProducts = await this.getProducts();
      const categories = [...new Set(allProducts.data.map(p => p.category).filter(Boolean))] as string[];
      return categories;
    } catch (error) {
      console.error('Error getting categories:', error);
      const categories = [...new Set(getFallbackProducts().map(p => p.category).filter(Boolean))] as string[];
      return categories;
    }
  }

  // Obtener marcas disponibles - usar datos locales como fallback
  static async getBrands(): Promise<string[]> {
    try {
      const allProducts = await this.getProducts();
      const brands = [...new Set(allProducts.data.map(p => p.brand).filter(Boolean))] as string[];
      return brands;
    } catch (error) {
      console.error('Error getting brands:', error);
      const brands = [...new Set(getFallbackProducts().map(p => p.brand).filter(Boolean))] as string[];
      return brands;
    }
  }

  // Obtener filtros disponibles - usar datos locales como fallback
  static async getAvailableFilters(): Promise<{
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
  }> {
    try {
      const [categories, brands] = await Promise.all([
        this.getCategories(),
        this.getBrands()
      ]);
      
      return {
        categories,
        brands,
        priceRange: { min: 0, max: 10000 } // Default price range
      };
    } catch (error) {
      console.error('Error getting filters:', error);
      const categories = [...new Set(getFallbackProducts().map(p => p.category).filter(Boolean))] as string[];
      const brands = [...new Set(getFallbackProducts().map(p => p.brand).filter(Boolean))] as string[];
      
      return {
        categories,
        brands,
        priceRange: { min: 0, max: 10000 }
      };
    }
  }
}

// Hook personalizado para usar el servicio de productos
export const useProductService = () => {
  return {
    getProducts: ProductService.getProducts,
    getProductById: ProductService.getProductById,
    searchProducts: ProductService.searchProducts,
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
  return products;
};

// Función para manejar errores de API y usar datos locales como fallback
export const handleApiError = <T>(error: Error, fallbackData: T): T => {
  console.warn('API error, using fallback data:', error);
  return fallbackData;
};