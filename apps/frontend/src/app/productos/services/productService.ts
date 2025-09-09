import { Product } from '../types';
// Fallback helpers & data when API is down
import {
  products as localProducts,
  searchProducts as localSearchProducts
} from '../data/products';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    };

    try {
      console.log("[ApiClient] Fetching:", url, config);
      const response = await fetch(url, config);

      if (!response.ok) {
        const text = await response.text();
        console.error(`[ApiClient] Error response: ${response.status}`, text);
        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
      }
      const json = await response.json();
      console.log("[ApiClient] Success:", json);
      return json as T;
    } catch (err: any) {
      console.error("[ApiClient] Network/Fetch error:", err); // 👈 log network error
      const msg = (err && err.message) ? err.message : String(err);
      throw new Error(
        msg.includes('Failed to fetch') || msg.includes('fetch failed')
          ? 'Network error: Could not connect to the server. Please check if the backend is running.'
          : msg
    );
  }
}

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }
}

const apiClient = new ApiClient(API_BASE_URL);

export class ProductService {
  /**
   * Search products via /search. If API fails, fallback to local search.
   */
  static async searchProducts(query: string): Promise<Product[]> {
    const q = query?.trim() ?? '';
    if (!q) return []; // keep empty if no query; UI handles it

    const params = new URLSearchParams({ q });
    const endpoint = `/search?${params.toString()}`;

    try {
      const apiProducts = await apiClient.get<any[]>(endpoint);
      const mapped = Array.isArray(apiProducts)
        ? apiProducts.map(p => this.mapApiProductToProduct(p))
        : [];
      return mapped;
    } catch (error) {
      // Fallback to local in-memory search
      console.error("[ProductService.searchProducts] API failed, falling back:", error);
      return localSearchProducts(q);
    }
  }

  /**
   * Related products = search by product name, skip first result, exclude the current product id.
   * Limit results (default 4).
   */
  static async getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
    const name = product?.name?.trim() ?? '';
    if (!name) return [];

    try {
      const results = await this.searchProducts(name);
      // Skip first result + exclude current product id
      return results
        .slice(1)
        .filter(p => p.id !== product.id)
        .slice(0, limit);
    } catch {
      // Fallback: use local search in the same way
      const localResults = localSearchProducts(name);
      return localResults
        .slice(1)
        .filter(p => p.id !== product.id)
        .slice(0, limit);
    }
  }

  // Map API product to local Product shape
  private static mapApiProductToProduct(apiProduct: any): Product {
    const links: string[] =
      Array.isArray(apiProduct?.link)
        ? apiProduct.link
        : (typeof apiProduct?.link === 'string' ? [apiProduct.link] : []);

    const safeId =
      (apiProduct && apiProduct.id) ||
      (globalThis.crypto?.randomUUID?.() ?? `api-${Math.random().toString(36).slice(2, 11)}`);

    return {
      id: String(safeId),
      name: apiProduct?.product_name?.trim() || 'Producto sin nombre',
      image: links.length > 0 ? links[0] : '/images/placeholder.jpg',
      category: apiProduct?.category_name?.trim() || 'Sin categoría',
      brand: apiProduct?.brand_name?.trim() || 'Sin marca',
      brandLogo: apiProduct?.brand_logo || '/images/brands/placeholder.png',
      isNew: Boolean(apiProduct?.is_new) || false,
      isOnSale: Boolean(apiProduct?.is_on_sale) || false,
      discount: Number(apiProduct?.discount) || 0,
      description: apiProduct?.description || 'Sin descripción',
      tags: Array.isArray(apiProduct?.tags) ? apiProduct.tags : [],
      additionalImages: links,
    };
  }
}

// Minimal hook (only what actually works with your backend)
export const useProductService = () => {
  return {
    searchProducts: ProductService.searchProducts,
    getRelatedProducts: ProductService.getRelatedProducts,
  };
};

// Optional: export local products in case you want to show them somewhere else easily
export const getFallbackProducts = (): Product[] => localProducts;
//console.log("API_BASE_URL is:", API_BASE_URL);