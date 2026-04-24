import { Product } from '../types';
// Fallback helpers & data when API is down
import {
  products as localProducts,
  searchProducts as localSearchProducts
} from '../data/products';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

// API response interfaces
interface ApiProduct {
  id?: string | number;
  product_id?: string | number;
  product_code?: string | number;
  product_name?: string;
  category_name?: string;
  brand_name?: string;
  brand_logo?: string;
  new_product?: boolean;
  discount?: number;
  discount_percent?: number;
  discount_percentage?: number;
  description?: string;
  tags?: string[];
  link?: string | string[];
}

interface ApiError {
  message?: string;
  [key: string]: unknown;
}

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
      const response = await fetch(url, config);

      if (!response.ok) {
        const text = await response.text();
        console.error(`[ApiClient] Error response: ${response.status}`, text);
        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
      }
      const json = await response.json();
      return json as T;
    } catch (err: unknown) {
      console.error("[ApiClient] Network/Fetch error:", err);
      const msg = (err && typeof err === 'object' && err !== null && 'message' in err)
        ? (err as ApiError).message || String(err)
        : String(err);
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

const IMAGE_URL_PATTERN = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;

function isRenderableImageUrl(value: string): boolean {
  return IMAGE_URL_PATTERN.test(value);
}

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
      const apiProducts = await apiClient.get<ApiProduct[]>(endpoint);
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

  static async getAllProducts(limit?: number): Promise<Product[]> {
    const endpoint = `/products`;

    try {
      const apiProducts = await apiClient.get<ApiProduct[]>(endpoint);
      const mappedProducts = Array.isArray(apiProducts)
        ? apiProducts.map(p => this.mapApiProductToProduct(p))
        : [];
      
      // Apply limit if specified
      return limit ? mappedProducts.slice(0, limit) : mappedProducts;
    } catch (error) {
      console.error("[ProductService.getAllProducts] API failed, falling back:", error);
      const fallbackProducts = localProducts;
      return limit ? fallbackProducts.slice(0, limit) : fallbackProducts;
    }
  }



  // Map API product to local Product shape
  private static mapApiProductToProduct(apiProduct: ApiProduct): Product {
    const links: string[] =
      Array.isArray(apiProduct?.link)
        ? apiProduct.link
        : (typeof apiProduct?.link === 'string' ? [apiProduct.link] : []);

    const imageLinks = links.filter(isRenderableImageUrl);

    const safeId =
      (apiProduct && (apiProduct.product_id || apiProduct.id || apiProduct.product_code)) ||
      (globalThis.crypto?.randomUUID?.() ?? `api-${Math.random().toString(36).slice(2, 11)}`);

    return {
      id: String(safeId),
      name: apiProduct?.product_name?.trim() || 'Producto sin nombre',
      image: imageLinks[0] || '/images/brands/placeholder.png',
      category: apiProduct?.category_name?.trim() || 'Sin categoría',
      brand: apiProduct?.brand_name?.trim() || 'Sin marca',
      brandLogo: apiProduct?.brand_logo || '/images/brands/placeholder.png',
      isNew: Boolean(apiProduct?.new_product) || false,
      discount: (() => {
        const raw = apiProduct?.discount ?? apiProduct?.discount_percent ?? apiProduct?.discount_percentage;
        let d = 0;
        if (typeof raw === 'number') {
          d = raw > 0 && raw < 1 ? Math.round(raw * 100) : Math.round(raw);
        } else if (typeof raw === 'string') {
          const parsed = parseInt(String(raw).replace(/[^\d.-]/g, ''), 10);
          d = Number.isFinite(parsed) ? parsed : 0;
        }
        return Math.max(0, Math.min(100, d));
      })(),
      description: apiProduct?.description || 'Sin descripción',
      tags: Array.isArray(apiProduct?.tags) ? apiProduct.tags : [],
      additionalImages: imageLinks,
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
