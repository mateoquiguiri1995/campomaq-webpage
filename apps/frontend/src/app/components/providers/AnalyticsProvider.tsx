'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView, initializeAnalytics } from '@/lib/analytics';
import CookieConsentBanner from '@/app/components/ui/CookieConsentBanner';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize analytics on mount
  useEffect(() => {
    // Initialize analytics (will check for consent internally)
    initializeAnalytics();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Get page title based on route
      const getPageTitle = (path: string): string => {
        switch (path) {
          case '/':
            return 'Inicio | Campomaq - Maquinaria Agrícola y Florícola';
          case '/nosotros':
            return 'Nosotros | Campomaq - Conoce Nuestra Historia';
          case '/servicios':
            return 'Servicios | Campomaq - Soporte Técnico Especializado';
          case '/productos':
            return 'Productos | Campomaq - Catálogo de Maquinaria Agrícola';
          case '/contacto':
            return 'Contacto | Campomaq - Contáctanos';
          default:
            if (path.startsWith('/productos')) {
              if (searchParams?.get('search')) {
                return `Búsqueda: ${searchParams.get('search')} | Campomaq`;
              }
              if (searchParams?.get('brand')) {
                return `${searchParams.get('brand')} | Campomaq`;
              }
              if (searchParams?.get('category')) {
                return `${searchParams.get('category')} | Campomaq`;
              }
              return 'Productos | Campomaq';
            }
            return 'Campomaq | Maquinaria Agrícola y Florícola';
        }
      };

      const title = getPageTitle(pathname);
      
      // Small delay to ensure the page has loaded
      const timer = setTimeout(() => {
        trackPageView(url, title);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  return (
    <>
      {children}
      <CookieConsentBanner />
    </>
  );
};

export default AnalyticsProvider;