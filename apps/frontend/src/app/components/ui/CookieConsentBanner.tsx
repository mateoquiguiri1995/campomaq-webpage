'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CookieConsent, CookieConsentState } from '@/types/analytics';
import { initializeAnalytics, updateAnalyticsConsent } from '@/lib/analytics';

const CookieConsentBanner: React.FC = () => {
  const [consentState, setConsentState] = useState<CookieConsentState>({
    consent: null,
    hasConsented: false,
    showBanner: false,
    isLoading: true,
  });

  const [showDetails, setShowDetails] = useState(false);

  // Check for existing consent on mount
  useEffect(() => {
    const checkConsent = () => {
      try {
        const stored = localStorage.getItem('campomaq_cookie_consent');
        if (stored) {
          const consent = JSON.parse(stored) as CookieConsent;
          // Check if consent is less than 1 year old
          const isValid = Date.now() - consent.timestamp < 365 * 24 * 60 * 60 * 1000;
          
          if (isValid) {
            setConsentState({
              consent,
              hasConsented: true,
              showBanner: false,
              isLoading: false,
            });
            // Initialize analytics with existing consent
            initializeAnalytics(consent);
            return;
          } else {
            // Remove expired consent
            localStorage.removeItem('campomaq_cookie_consent');
          }
        }
        
        // No valid consent found, show banner
        setConsentState(prev => ({
          ...prev,
          showBanner: true,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error checking cookie consent:', error);
        setConsentState(prev => ({
          ...prev,
          showBanner: true,
          isLoading: false,
        }));
      }
    };

    checkConsent();
  }, []);

  const handleAcceptAll = () => {
    const consent: CookieConsent = {
      analytics: true,
      marketing: false,
      functional: true,
      timestamp: Date.now(),
    };

    saveConsent(consent);
  };

  const handleAcceptNecessary = () => {
    const consent: CookieConsent = {
      analytics: false,
      marketing: false,
      functional: true,
      timestamp: Date.now(),
    };

    saveConsent(consent);
  };

  const handleCustomConsent = (analytics: boolean) => {
    const consent: CookieConsent = {
      analytics,
      marketing: false,
      functional: true,
      timestamp: Date.now(),
    };

    saveConsent(consent);
    setShowDetails(false);
  };

  const saveConsent = (consent: CookieConsent) => {
    try {
      localStorage.setItem('campomaq_cookie_consent', JSON.stringify(consent));
      updateAnalyticsConsent(consent);
      
      setConsentState({
        consent,
        hasConsented: true,
        showBanner: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  // Don't render while loading or if already consented
  if (consentState.isLoading || !consentState.showBanner) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t-4 border-campomaq shadow-2xl"
      >
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Main Banner Content */}
          {!showDetails && (
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              {/* Icon and Text */}
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0">
                  <Cookie className="w-6 h-6 text-campomaq" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Uso de Cookies en Campomaq
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Utilizamos cookies para mejorar tu experiencia de navegación, 
                    analizar el tráfico del sitio y personalizar el contenido. 
                    Las cookies nos ayudan a entender qué productos te interesan más 
                    y cómo podemos mejorar nuestro servicio.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-campomaq text-black font-semibold rounded-lg 
                           hover:bg-yellow-300 transition-colors duration-200 
                           focus:outline-none focus:ring-2 focus:ring-campomaq focus:ring-offset-2"
                >
                  Aceptar todas
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg 
                           hover:bg-gray-200 transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                  Solo necesarias
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-6 py-3 border-2 border-campomaq text-gray-700 font-semibold rounded-lg 
                           hover:bg-campomaq hover:text-black transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-campomaq focus:ring-offset-2"
                >
                  Personalizar
                </button>
              </div>
            </div>
          )}

          {/* Detailed Settings */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Configuración de Cookies
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Cerrar configuración"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Cookie Categories */}
              <div className="grid gap-4">
                {/* Necessary Cookies */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Cookies Necesarias
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Estas cookies son esenciales para el funcionamiento básico 
                          del sitio web y no se pueden desactivar.
                        </p>
                        <div className="text-xs text-gray-500">
                          • Gestión de sesión • Seguridad • Preferencias básicas
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Siempre activas
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <BarChart3 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Cookies de Análisis
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Nos ayudan a entender cómo utilizas nuestro sitio web 
                          para poder mejorarlo continuamente.
                        </p>
                        <div className="text-xs text-gray-500">
                          • Google Analytics • Estadísticas de uso • Rendimiento del sitio
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={() => handleCustomConsent(true)}
                        className="bg-campomaq text-black px-3 py-1 rounded-full text-xs font-medium
                                 hover:bg-yellow-300 transition-colors"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleCustomConsent(false)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium
                                 hover:bg-gray-300 transition-colors"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                <p>
                  Puedes cambiar tus preferencias en cualquier momento. 
                  Para más información, consulta nuestra política de cookies.
                  🌾 <strong>Campomaq</strong> - Comprometidos con tu privacidad.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsentBanner;