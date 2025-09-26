// src/app/layout.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";
import Chatbot from "@/app/components/Chatbot";
import AnalyticsProvider from "@/app/components/providers/AnalyticsProvider";

export const metadata: Metadata = {
  title: "Campomaq | Maquinaria Agrícola y Florícola en Ecuador",
  description: "Campo Maq ofrece motocultores, bombas de fumigación, motoguadañas, motosierras, y más equipos agrícolas de calidad. Soluciones confiables con servicio técnico especializado en Cayambe, Ecuador.",
};

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
      </body>
    </html>
  );
}
