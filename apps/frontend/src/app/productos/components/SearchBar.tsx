// src/app/productos/components/SearchBar.tsx
"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const quickOptions = ["Motocultor", "Motoguadaña", "Bombas de Fumigar", "Generadores", "Motosierra", "Desbrozadora", "Herramientas de Jardín"];

  // Efecto para cargar la búsqueda desde URL al montar el componente
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl && searchFromUrl !== searchInput) {
      setSearchInput(searchFromUrl);
      // Ejecutar búsqueda automáticamente solo si es diferente
      if (onSearch) {
        onSearch(searchFromUrl);
      }
    }
  }, [searchParams]); // Removido onSearch de las dependencias

  const addTag = (tag: string) => {
    if (tags.length < 3 && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setShowQuickOptions(false);
      // Ejecutar búsqueda automáticamente con los nuevos tags
      const searchQuery = [...newTags, searchInput].filter(Boolean).join(" ");
      if (onSearch && searchQuery.trim()) {
        onSearch(searchQuery.trim());
      }
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    // Ejecutar búsqueda automáticamente después de remover tag
    const searchQuery = [...newTags, searchInput].filter(Boolean).join(" ");
    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearch = () => {
    const searchQuery = [...tags, searchInput].filter(Boolean).join(" ");
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      // Actualizar URL sin recargar la página
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      } else {
        params.delete('search');
      }
      router.replace(`/productos?${params.toString()}`, { scroll: false });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setTags([]);
    setSearchInput("");
    if (onSearch) {
      onSearch("");
    }
    // Limpiar parámetro de búsqueda de la URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.replace(`/productos?${params.toString()}`, { scroll: false });
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

  // REMOVIDO: Efecto que causaba el bucle infinito
  // Este useEffect estaba causando re-renders constantes
  /*
  useEffect(() => {
    if (searchInput || tags.length > 0) {
      const searchQuery = [...tags, searchInput].filter(Boolean).join(" ");
      if (onSearch && searchQuery.trim()) {
        // Debounce para evitar demasiadas búsquedas
        const timeoutId = setTimeout(() => {
          onSearch(searchQuery.trim());
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [searchInput, tags, onSearch]);
  */

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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 outline-none text-sm text-black placeholder-gray-400 bg-transparent"
        />

        {/* Botón limpiar */}
        {(tags.length > 0 || searchInput) && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              clearSearch();
            }}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}

        {/* Icono buscar */}
        <button 
          onClick={handleSearch}
          className="p-1 rounded-full hover:bg-black transition-colors duration-200"
        >
          <Search className="w-6 h-6 text-gray-500 hover:text-yellow-200 cursor-pointer" />
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
                disabled={tags.includes(opt) || tags.length >= 3}
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