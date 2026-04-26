// src/app/layout.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";

import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";
import Chatbot from "@/app/components/Chatbot";
import AnalyticsProvider from "@/app/components/providers/AnalyticsProvider";

export const metadata: Metadata = {
  title: "Campomaq | Maquinaria Agrícola y Florícola en Ecuador",
  description: "Campo Maq ofrece motocultores, bombas de fumigación, motoguadañas, motosierras, y más equipos agrícolas de calidad. Soluciones confiables con servicio técnico especializado en Cayambe, Ecuador.",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
const GA_ENABLED =
  GA_ID &&
  (process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_GA_DEBUG === 'true');
const GA_DEBUG = process.env.NEXT_PUBLIC_GA_DEBUG === 'true';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className="bg-yellow text-black antialiased">
        <Suspense fallback={null}>
          <AnalyticsProvider>
            {/* Navbar siempre visible */}
            <Navbar />

            {/* Contenido de la página actual */}
            <main>{children}</main>

            {/* Footer y Chatbot siempre visibles */}
            <Footer />
            <Chatbot />
          </AnalyticsProvider>
        </Suspense>

        {/* Google Analytics — loaded after interactive, zero render-blocking impact */}
        {GA_ENABLED && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  analytics_storage: 'granted',
                  ad_storage: 'denied',
                  wait_for_update: 300
                });
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  send_page_view: false,
                  anonymize_ip: true${GA_DEBUG ? ',\n                  debug_mode: true' : ''}
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
