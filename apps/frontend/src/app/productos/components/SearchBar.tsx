// src/app/productos/components/SearchBar.tsx
"use client";

import { Search, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

const QUICK_OPTIONS = [
  "Motocultor",
  "Desbrozadora",
  "Bombas de Fumigar",
  "Motoazada",
  "Motosierra"
];

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastAppliedUrlSearchRef = useRef<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Efecto para cargar la búsqueda desde URL al montar el componente y cuando cambia
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');

    // Evitar trabajo repetido si ya aplicamos este valor desde la URL
    if (searchFromUrl === lastAppliedUrlSearchRef.current) return;

    if (searchFromUrl) {
      // Verificar si la búsqueda es una de las etiquetas rápidas
      if (QUICK_OPTIONS.includes(searchFromUrl)) {
        setSelectedTag(searchFromUrl);
        setSearchInput("");
      } else {
        setSearchInput(searchFromUrl);
        setSelectedTag("");
      }

      onSearch?.(searchFromUrl);
    }

    // Registrar el último valor aplicado desde la URL (incluye null)
    lastAppliedUrlSearchRef.current = searchFromUrl;
  }, [searchParams, onSearch]);

  const addTag = (tag: string) => {
    if (!selectedTag) {
      setSelectedTag(tag);
      setSearchInput(""); // Limpiar el input cuando se selecciona una etiqueta
      setShowQuickOptions(false);
      
      // Ejecutar búsqueda automáticamente
      if (onSearch) {
        onSearch(tag);
      }
      
      // Actualizar URL
      updateURL(tag);
    }
  };

  const removeTag = () => {
    setSelectedTag("");
    // Al remover la etiqueta, mantener focus en el input si estaba enfocado
    if (isInputFocused && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Si hay texto en el input, ejecutar búsqueda con ese texto
    if (searchInput.trim()) {
      if (onSearch) {
        onSearch(searchInput.trim());
      }
      updateURL(searchInput.trim());
    } else {
      // Si no hay texto, limpiar búsqueda
      if (onSearch) {
        onSearch("");
      }
      clearURL();
    }
  };

  const handleSearch = () => {
    const searchQuery = selectedTag || searchInput.trim();
    if (searchQuery && onSearch) {
      onSearch(searchQuery);
      updateURL(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!selectedTag && searchInput.trim()) {
        handleSearch();
      }
    }
    
    // Permitir usar Backspace para eliminar etiqueta cuando input está vacío
    if (e.key === "Backspace" && selectedTag && !searchInput) {
      removeTag();
    }
    
    // Ocultar panel cuando se empiece a escribir
    if (e.key.length === 1 && showQuickOptions) {
      setShowQuickOptions(false);
    }
  };

  const clearSearch = () => {
    setSelectedTag("");
    setSearchInput("");
    if (onSearch) {
      onSearch("");
    }
    clearURL();
    
    // Mantener focus después de limpiar
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const updateURL = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.replace(`/productos?${params.toString()}`, { scroll: false });
  };

  const clearURL = () => {
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

  // Auto-focus en el input cuando se abre el panel de opciones
  useEffect(() => {
    if (showQuickOptions && !selectedTag && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showQuickOptions, selectedTag]);

  const hasContent = selectedTag || searchInput.trim();
  const placeholder = selectedTag ? "" : "Buscar productos...";

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto px-4 sm:px-0"
    >
      {/* Barra de búsqueda */}
      <motion.div
        className={`
          relative flex items-center gap-2 border-2 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 w-full bg-white 
          transition-all duration-300 ease-out cursor-text
          ${isInputFocused || showQuickOptions 
            ? 'border-black shadow-lg shadow-black/10 scale-[1.02]' 
            : 'border-gray-200 shadow-md hover:border-gray-300 hover:shadow-lg'
          }
        `}
        onClick={() => {
          if (!selectedTag) {
            setShowQuickOptions(true);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }
        }}
        whileTap={{ scale: 0.995 }}
      >
        {/* Etiqueta seleccionada */}
        <AnimatePresence mode="wait">
          {selectedTag && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -10 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center gap-2 bg-gradient-to-r from-campomaq via-yellow-300 to-white-50 text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-lg border border-yellow-300 flex-shrink-0 hover:shadow-xl transition-all duration-300 group"
              style={{
                backgroundSize: '200% 100%',
                animation: 'none'
              }}
              whileHover={{ 
                scale: 1.05,
                backgroundPosition: '100% 50%',
                transition: { duration: 0.3 }
              }}
            >
              <span className="truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[140px]">
                {selectedTag}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag();
                }}
                className="hover:bg-black/20 rounded-full p-0.5 sm:p-1 transition-all duration-200 hover:scale-125 hover:rotate-90"
                aria-label="Remover etiqueta"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Input de búsqueda */}
        <div className="flex-1 flex items-center min-w-0 relative">
          <AnimatePresence mode="wait">
            <motion.input
              key={selectedTag ? "disabled" : "enabled"}
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchInput}
              disabled={!!selectedTag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onChange={(e) => {
                setSearchInput(e.target.value);
                // Ocultar panel cuando se empiece a escribir
                if (e.target.value.length > 0 && showQuickOptions) {
                  setShowQuickOptions(false);
                }
              }}
              onKeyDown={handleKeyPress}
              onFocus={() => {
                setIsInputFocused(true);
                if (!selectedTag) {
                  setShowQuickOptions(true);
                }
              }}
              onBlur={() => setIsInputFocused(false)}
              className={`
                w-full outline-none text-sm sm:text-base text-black placeholder-gray-400 bg-transparent
                transition-all duration-200
                ${selectedTag 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'placeholder-gray-500'
                }
              `}
            />
          </AnimatePresence>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Botón limpiar */}
          <AnimatePresence>
            {hasContent && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  clearSearch();
                }}
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Indicador de opciones rápidas */}
          {!selectedTag && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickOptions(!showQuickOptions);
              }}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
              aria-label="Mostrar opciones rápidas"
              animate={{ rotate: showQuickOptions ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-black transition-colors duration-200" />
            </motion.button>
          )}

          {/* Botón buscar */}
          <motion.button
            onClick={handleSearch}
            disabled={!hasContent}
            className={`
              p-1.5 sm:p-2 rounded-full transition-all duration-200
              ${hasContent
                ? 'bg-black hover:bg-gray-800 text-yellow-400 hover:text-yellow-300 shadow-md hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
            whileHover={hasContent ? { scale: 1.05 } : {}}
            whileTap={hasContent ? { scale: 0.95 } : {}}
            aria-label="Buscar"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Panel de opciones rápidas */}
      <AnimatePresence>
        {showQuickOptions && !selectedTag && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-0 mt-3 w-full bg-white border-2 border-gray-100 rounded-2xl shadow-2xl p-3 sm:p-4 z-20 backdrop-blur-sm overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Efecto de brillo sutil en el fondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-transparent pointer-events-none" />
            
            <div className="relative flex flex-wrap gap-2">
              {QUICK_OPTIONS.map((option, index) => (
                <motion.button
                  key={option}
                  onClick={() => addTag(option)}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.07, 
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-campomaq hover:to-white-50 hover:text-black text-gray-700 text-xs sm:text-sm font-medium transition-all duration-300 group border border-gray-200 hover:border-yellow-300 hover:shadow-lg overflow-hidden"
                >
                  {/* Efecto de shimmer en hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                  
                  <span className="relative z-10 flex items-center gap-2 cursor-pointer truncate max-w-[100px] xs:max-w-[120px] sm:max-w-none">
                    {option}
                  </span>
                </motion.button>
              ))}
            </div>
            
            {/* Indicador visual en la parte inferior */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}