// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";
import Chatbot from "@/app/components/Chatbot";

export const metadata: Metadata = {
  title: "Campo Maq",
  description: "Official Campo Maq website. Muy pronto.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-yellow text-black antialiased">
        {/* Navbar siempre visible */}
        <Navbar />

        {/* Contenido de la página actual */}
        <main>{children}</main>

        {/* Footer y Chatbot siempre visibles */}
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
