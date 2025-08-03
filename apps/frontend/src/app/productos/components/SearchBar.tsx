// src/app/productos/components/SearchBar.tsx
"use client";

import { Search, ShoppingCart, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar() {
  const [cartCount] = useState<number>(1); // Simulación
  const [tags, setTags] = useState<string[]>([]);
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const quickOptions = ["Motocultor", "Motoguadaña", "Bombas de Fumigar", "Generadores", "Motosierra", "Desbrozadora", "Herramientas de Jardín"];

  const addTag = (tag: string) => {
    if (tags.length < 3 && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setShowQuickOptions(false);
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Cierra el panel al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowQuickOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl flex items-center gap-3 px-3 md:px-0"
    >
      {/* Barra de búsqueda */}
      <div
        className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1.5 w-full bg-white shadow-sm focus-within:shadow-md transition-shadow duration-200 cursor-text"
        onClick={() => setShowQuickOptions(true)}
      >
        {/* Etiquetas */}
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-campomaq text-black px-2 py-0.5 rounded-full text-xs font-medium hover:bg-yellow-200 transition-colors duration-200 cursor-pointer"
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="hover:text-red-500 transition-colors duration-200"
            >
              <X className="w-4 h-4 cursor-pointer" />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          type="text"
          placeholder="Buscar..."
          className="flex-1 outline-none text-sm text-black placeholder-gray-400 bg-transparent"
        />

        {/* Icono buscar */}
        <button className="p-1 rounded-full hover:bg-black transition-colors duration-200">
          <Search className="w-6 h-6 text-gray-500 hover:text-yellow-200 cursor-pointer" />
        </button>
      </div>

      {/* Carrito */}
      <div className="relative flex-shrink-0">
        <button className="relative p-2 rounded-full bg-white hover:bg-black shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-yellow-200" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full shadow cursor-pointer">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Panel de botones rápidos con animación */}
      <AnimatePresence>
        {showQuickOptions && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex flex-wrap gap-2 z-10"
          >
            {quickOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => addTag(opt)}
                className="px-4 py-1.5 rounded-full bg-gray-100 text-black hover:bg-black hover:text-yellow-200 text-sm transition-colors duration-200 cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
