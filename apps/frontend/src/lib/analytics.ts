import {
  GAConfig,
  ProductViewEvent,
  SearchEvent,
  FilterEvent,
  WhatsAppClickEvent,
  CategoryClickEvent,
  FileDownloadEvent,
  ImageNavigationEvent,
  VirtualPageView,
  EcommerceEvent,
  CookieConsent
} from '@/types/analytics';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

class GoogleAnalytics {
  private config: GAConfig;
  private isInitialized: boolean = false;
  private hasConsent: boolean = false;

  constructor() {
    this.config = {
      trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
      // isDevelopment: false,
      isDevelopment: process.env.NODE_ENV === 'development',
      debugMode: process.env.NODE_ENV === 'development',
      enableConsent: true
    };

    // Log environment info for debugging
    console.log('[GA] Config loaded:', {
      hasTrackingId: !!this.config.trackingId,
      trackingId: this.config.trackingId,
      isDevelopment: this.config.isDevelopment,
      nodeEnv: process.env.NODE_ENV
    });
  }

  // Initialize Google Analytics
  async initialize(consent?: CookieConsent): Promise<void> {
    if (!this.config.trackingId) {
      console.warn('[GA] Tracking ID not found');
      return;
    }

    if (this.config.isDevelopment) {
      console.log('[GA] Development mode - tracking disabled');
      return;
    }

    try {
      // Check consent if required
      if (this.config.enableConsent) {
        const hasAnalyticsConsent = consent?.analytics ?? this.checkStoredConsent();

        if (!hasAnalyticsConsent) {
          console.log('[GA] Analytics consent not granted');
          return;
        }
        this.hasConsent = true;
      }

      await this.loadGtagScript();
      this.initializeGtag();
      this.isInitialized = true;
      console.log('[GA] Initialized successfully');
    } catch (error) {
      console.error('[GA] Initialization failed:', error);
    }
  }

  // Load Google Analytics script
  private async loadGtagScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('gtag-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'gtag-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.trackingId}`;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Analytics script'));
      
      document.head.appendChild(script);
    });
  }

  // Initialize gtag
  private initializeGtag(): void {
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    
    // Configure with consent settings
    window.gtag('config', this.config.trackingId, {
      debug_mode: this.config.debugMode,
      send_page_view: true,
      anonymize_ip: true,
      cookie_flags: 'secure;samesite=none',
    });

    // Set consent mode
    if (this.config.enableConsent) {
      window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: 500,
      });

      if (this.hasConsent) {
        this.updateConsent({
          analytics: true,
          marketing: false,
          functional: true,
          timestamp: Date.now()
        });
      }
    }
  }

  // Check stored consent
  private checkStoredConsent(): boolean {
    try {
      const stored = localStorage.getItem('campomaq_cookie_consent');

      if (!stored) {
        return false;
      }

      const consent = JSON.parse(stored);
      return consent.analytics === true;
    } catch (error) {
      console.error('[GA] Error checking stored consent:', error);
      return false;
    }
  }

  // Update consent settings
  updateConsent(consent: CookieConsent): void {
    this.hasConsent = consent.analytics;

    // Store consent first
    try {
      localStorage.setItem('campomaq_cookie_consent', JSON.stringify(consent));
    } catch (error) {
      console.error('[GA] Failed to store consent:', error);
    }

    // Initialize if consent granted and not already initialized
    if (consent.analytics && !this.isInitialized) {
      this.initialize(consent);
    }

    // Update gtag consent if already initialized
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: 'denied', // We don't use ads
        functionality_storage: consent.functional ? 'granted' : 'denied',
        personalization_storage: 'denied',
      });
    }
  }

  // Track page views
  pageView(path: string, title?: string): void {
    if (!this.canTrack()) return;

    window.gtag('config', this.config.trackingId, {
      page_path: path,
      page_title: title || document.title,
    });

    this.logEvent('Page View', { path, title });
  }

  // Track virtual page views (for product modals)
  virtualPageView(data: VirtualPageView): void {
    if (!this.canTrack()) return;

    window.gtag('config', this.config.trackingId, {
      page_title: data.page_title,
      page_location: data.page_location,
      page_path: data.page_path,
      content_group1: data.content_group1,
      content_group2: data.content_group2,
    });

    this.logEvent('Virtual Page View', data);
  }

  // Track custom events
  event(eventName: string, parameters: Record<string, unknown> = {}): void {
    if (!this.canTrack()) return;

    window.gtag('event', eventName, {
      event_category: parameters.category || 'general',
      event_label: parameters.label,
      value: parameters.value,
      ...parameters
    });

    this.logEvent(eventName, parameters);
  }

  // Track product views
  trackProductView(data: ProductViewEvent): void {
    if (!this.canTrack()) return;

    // Virtual pageview for product
    const productSlug = this.createProductSlug(data.product_name);
    this.virtualPageView({
      page_title: `${data.product_name} | Campomaq`,
      page_location: `${window.location.origin}/product/${productSlug}`,
      page_path: `/product/${productSlug}`,
      content_group1: 'Product',
      content_group2: data.product_category
    });

    // Event tracking
    this.event('view_item', {
      item_id: data.product_id,
      item_name: data.product_name,
      item_category: data.product_category,
      item_brand: data.product_brand,
      source: data.source,
      category: 'Product',
      label: data.product_name
    });
  }

  // Track search queries
  trackSearch(data: SearchEvent): void {
    this.event('search', {
      search_term: data.search_term,
      search_results_count: data.search_results_count,
      search_source: data.search_source,
      category: 'Search',
      label: data.search_term
    });
  }

  // Track filter usage
  trackFilter(data: FilterEvent): void {
    this.event('filter_used', {
      filter_type: data.filter_type,
      filter_value: data.filter_value,
      previous_filter: data.previous_filter,
      category: 'Filter',
      label: `${data.filter_type}:${data.filter_value}`
    });
  }

  // Track WhatsApp clicks
  trackWhatsAppClick(data: WhatsAppClickEvent): void {
    this.event('whatsapp_click', {
      product_id: data.product_id,
      product_name: data.product_name,
      product_category: data.product_category,
      click_source: data.click_source,
      page_location: data.page_location,
      category: 'Conversion',
      label: data.product_name || 'General Contact'
    });
  }

  // Track category clicks
  trackCategoryClick(data: CategoryClickEvent): void {
    this.event('category_click', {
      category_name: data.category_name,
      click_source: data.click_source,
      search_query: data.search_query,
      category: 'Navigation',
      label: data.category_name
    });
  }

  // Track file downloads
  trackFileDownload(data: FileDownloadEvent): void {
    this.event('file_download', {
      file_name: data.file_name,
      file_type: data.file_type,
      download_source: data.download_source,
      category: 'Conversion',
      label: data.file_name
    });
  }

  // Track image navigation
  trackImageNavigation(data: ImageNavigationEvent): void {
    this.event('image_navigation', {
      product_id: data.product_id,
      product_name: data.product_name,
      action: data.action,
      image_index: data.image_index,
      total_images: data.total_images,
      category: 'Engagement',
      label: `${data.product_name} - ${data.action}`
    });
  }

  // Track ecommerce events
  trackEcommerce(eventName: string, data: EcommerceEvent): void {
    if (!this.canTrack()) return;

    window.gtag('event', eventName, {
      currency: data.currency,
      value: data.value,
      items: data.items
    });

    this.logEvent(`Ecommerce: ${eventName}`, data);
  }

  // Utility method to create product slug
  private createProductSlug(productName: string): string {
    return productName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Check if tracking is allowed
  private canTrack(): boolean {
    if (this.config.isDevelopment) {
      return false;
    }
    
    if (this.config.enableConsent && !this.hasConsent) {
      return false;
    }

    if (!window.gtag || !this.isInitialized) {
      console.warn('[GA] Analytics not initialized');
      return false;
    }

    return true;
  }

  // Log events for debugging
  private logEvent(eventName: string, data: unknown): void {
    if (this.config.debugMode) {
      console.log(`[GA] ${eventName}:`, data);
    }
  }

  // Get initialization status
  getStatus(): { isInitialized: boolean; hasConsent: boolean; isDevelopment: boolean } {
    return {
      isInitialized: this.isInitialized,
      hasConsent: this.hasConsent,
      isDevelopment: this.config.isDevelopment
    };
  }
}

// Create singleton instance
const analytics = new GoogleAnalytics();

// Export convenience functions
export const initializeAnalytics = (consent?: CookieConsent) => analytics.initialize(consent);
export const updateAnalyticsConsent = (consent: CookieConsent) => analytics.updateConsent(consent);
export const trackPageView = (path: string, title?: string) => analytics.pageView(path, title);
export const trackVirtualPageView = (data: VirtualPageView) => analytics.virtualPageView(data);
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => analytics.event(eventName, parameters);
export const trackProductView = (data: ProductViewEvent) => analytics.trackProductView(data);
export const trackSearch = (data: SearchEvent) => analytics.trackSearch(data);
export const trackFilter = (data: FilterEvent) => analytics.trackFilter(data);
export const trackWhatsAppClick = (data: WhatsAppClickEvent) => analytics.trackWhatsAppClick(data);
export const trackCategoryClick = (data: CategoryClickEvent) => analytics.trackCategoryClick(data);
export const trackFileDownload = (data: FileDownloadEvent) => analytics.trackFileDownload(data);
export const trackImageNavigation = (data: ImageNavigationEvent) => analytics.trackImageNavigation(data);
export const trackEcommerce = (eventName: string, data: EcommerceEvent) => analytics.trackEcommerce(eventName, data);
export const getAnalyticsStatus = () => analytics.getStatus();

export default analytics;