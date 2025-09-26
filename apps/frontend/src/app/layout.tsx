// src/app/layout.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";
import Chatbot from "@/app/components/Chatbot";
import AnalyticsProvider from "@/app/components/providers/AnalyticsProvider";

export const metadata: Metadata = {
  title: "Campo Maq",
  description: "Garantizamos Nuestro Servicio",
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
