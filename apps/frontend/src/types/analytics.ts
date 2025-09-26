// Google Analytics 4 Event Types
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, unknown>;
}

// Campomaq-specific event types
export interface ProductViewEvent {
  product_id: string;
  product_name: string;
  product_category: string;
  product_brand?: string;
  source: 'modal' | 'card' | 'search';
}

export interface SearchEvent {
  search_term: string;
  search_results_count?: number;
  search_source: 'header' | 'productos_page';
}

export interface FilterEvent {
  filter_type: 'brand' | 'category' | 'tab' | 'price';
  filter_value: string;
  previous_filter?: string;
}

export interface WhatsAppClickEvent {
  product_id?: string;
  product_name?: string;
  product_category?: string;
  click_source: 'modal' | 'product_card' | 'general';
  page_location: string;
}

export interface CategoryClickEvent {
  category_name: string;
  click_source: 'homepage' | 'sidebar' | 'mobile_menu';
  search_query?: string;
}

export interface FileDownloadEvent {
  file_name: string;
  file_type: string;
  download_source: string;
}

export interface ImageNavigationEvent {
  product_id: string;
  product_name: string;
  action: 'next' | 'prev' | 'thumbnail_click';
  image_index: number;
  total_images: number;
}

// Cookie consent types
export interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: number;
}

export interface CookieConsentState {
  consent: CookieConsent | null;
  hasConsented: boolean;
  showBanner: boolean;
  isLoading: boolean;
}

// GA4 Configuration
export interface GAConfig {
  trackingId: string;
  isDevelopment: boolean;
  debugMode: boolean;
  enableConsent: boolean;
}

// Virtual pageview type
export interface VirtualPageView {
  page_title: string;
  page_location: string;
  page_path: string;
  content_group1?: string;
  content_group2?: string;
}

// Enhanced ecommerce events
export interface EcommerceEvent {
  currency: string;
  value?: number;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    item_brand?: string;
    price?: number;
    quantity?: number;
  }>;
}