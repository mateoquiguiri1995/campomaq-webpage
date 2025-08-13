"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";

interface QuickFiltersProps {
  onFilterChange: (filters: string[]) => void;
  activeFilters: string[];
}

export default function QuickFilters({ onFilterChange, activeFilters }: QuickFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = [
    { id: "new", label: "Nuevos", color: "bg-green-100 text-green-800" },
    { id: "sale", label: "En Oferta", color: "bg-red-100 text-red-800" },
    { id: "popular", label: "Populares", color: "bg-blue-100 text-blue-800" },
    { id: "trending", label: "Tendencia", color: "bg-purple-100 text-purple-800" },
    { id: "honda", label: "Honda", color: "bg-gray-100 text-gray-800" },
    { id: "stihl", label: "STIHL", color: "bg-gray-100 text-gray-800" },
    { id: "husqvarna", label: "Husqvarna", color: "bg-gray-100 text-gray-800" },
    { id: "echo", label: "Echo", color: "bg-gray-100 text-gray-800" },
  ];

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className="mb-6">
      {/* Header de filtros */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros rápidos</span>
          {activeFilters.length > 0 && (
            <span className="bg-campomaq text-black text-xs px-2 py-1 rounded-full font-medium">
              {activeFilters.length}
            </span>
          )}
        </div>
        
        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Filtros activos */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {activeFilters.map((filterId) => {
            const filter = filterOptions.find(f => f.id === filterId);
            if (!filter) return null;
            
            return (
              <span
                key={filterId}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${filter.color} cursor-pointer hover:opacity-80 transition-opacity duration-200`}
                onClick={() => toggleFilter(filterId)}
              >
                {filter.label}
                <X className="w-3 h-3" />
              </span>
            );
          })}
        </div>
      )}

      {/* Opciones de filtros */}
      <div className={`grid gap-2 transition-all duration-300 ${
        isExpanded ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8' : 'grid-cols-2 sm:grid-cols-4'
      }`}>
        {filterOptions.slice(0, isExpanded ? filterOptions.length : 4).map((filter) => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeFilters.includes(filter.id)
                ? `${filter.color} ring-2 ring-offset-2 ring-campomaq`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Botón expandir/contraer */}
      {filterOptions.length > 4 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-sm text-campomaq hover:text-yellow-500 font-medium transition-colors duration-200"
        >
          {isExpanded ? "Mostrar menos" : "Mostrar más filtros"}
        </button>
      )}
    </div>
  );
}
