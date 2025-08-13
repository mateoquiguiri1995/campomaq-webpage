"use client";

import { useState, useMemo } from "react";
import CardProducto from "@/app/components/ui/CardProducto";
import { products, Product } from "../data/products";
import { ChevronLeft, ChevronRight, Filter, ChevronDown } from "lucide-react";
import QuickFilters from "./QuickFilters";

export default function AllProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showProductNames, setShowProductNames] = useState(false);
  const [showPriceFilters, setShowPriceFilters] = useState(false);
  const productsPerPage = 8;

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories;
  }, []);

  // Obtener nombres de productos únicos
  const productNames = useMemo(() => {
    return [...new Set(products.map(p => p.name))];
  }, []);

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
    
    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Aplicar filtros rápidos
    activeFilters.forEach(filter => {
      switch (filter) {
        case "new":
          filtered = filtered.filter(p => p.isNew);
          break;
        case "sale":
          filtered = filtered.filter(p => p.isOnSale);
          break;
        case "popular":
          // Filtrar productos populares (aquellos que están en la lista de populares)
          const popularIds = ["1", "2", "4", "6", "8", "10"];
          filtered = filtered.filter(p => popularIds.includes(p.id));
          break;
        case "trending":
          // Filtrar productos en tendencia (aquellos que están en la lista de trending)
          const trendingIds = ["3", "5", "7", "9", "11", "12"];
          filtered = filtered.filter(p => trendingIds.includes(p.id));
          break;
        case "honda":
          filtered = filtered.filter(p => p.brand?.toLowerCase() === "honda");
          break;
        case "stihl":
          filtered = filtered.filter(p => p.brand?.toLowerCase() === "stihl");
          break;
        case "husqvarna":
          filtered = filtered.filter(p => p.brand?.toLowerCase() === "husqvarna");
          break;
        case "echo":
          filtered = filtered.filter(p => p.brand?.toLowerCase() === "echo");
          break;
      }
    });

    // Ordenar productos
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "name":
      default:
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, activeFilters]);

  // Calcular productos para la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  return (
    <section className="my-8">
      {/* Filtros rápidos */}
      <QuickFilters 
        onFilterChange={handleFilterChange}
        activeFilters={activeFilters}
      />

      {/* Fila adicional de filtros */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap items-center gap-4">
          {/* Botón Nuevos */}
          <button
            onClick={() => handleFilterChange(activeFilters.includes("new") ? activeFilters.filter(f => f !== "new") : [...activeFilters, "new"])}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeFilters.includes("new")
                ? "bg-green-100 text-green-800 ring-2 ring-offset-2 ring-campomaq"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Nuevos
          </button>

          {/* Botón Más vendidos */}
          <button
            onClick={() => handleFilterChange(activeFilters.includes("popular") ? activeFilters.filter(f => f !== "popular") : [...activeFilters, "popular"])}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeFilters.includes("popular")
                ? "bg-blue-100 text-blue-800 ring-2 ring-offset-2 ring-campomaq"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Más vendidos
          </button>

          {/* Botón deslizante para nombres de productos */}
          <div className="relative">
            <button
              onClick={() => setShowProductNames(!showProductNames)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-200"
            >
              Nombres de productos
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProductNames ? 'rotate-180' : ''}`} />
            </button>
            
            {showProductNames && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 gap-1">
                  {productNames.slice(0, 10).map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        setShowProductNames(false);
                        // Aquí podrías implementar la lógica para filtrar por nombre específico
                      }}
                      className="text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botón deslizante para filtros de precio */}
          <div className="relative">
            <button
              onClick={() => setShowPriceFilters(!showPriceFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-200"
            >
              Filtrar por precio
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPriceFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showPriceFilters && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSortBy("price-low");
                      setShowPriceFilters(false);
                    }}
                    className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    Menos caro
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("price-high");
                      setShowPriceFilters(false);
                    }}
                    className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    Más caro
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("name");
                      setShowPriceFilters(false);
                    }}
                    className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    Por nombre
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header con filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Todos los Productos</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro por categoría */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-campomaq"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar por */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-campomaq"
          >
            <option value="name">Ordenar por nombre</option>
            <option value="price-low">Precio: menor a mayor</option>
            <option value="price-high">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <p className="text-gray-600">
          Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredAndSortedProducts.length)} de {filteredAndSortedProducts.length} productos
        </p>
      </div>

      {/* Grid de productos */}
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <CardProducto
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              category={product.category}
              brand={product.brand}
              brandLogo={product.brandLogo}
              isNew={product.isNew}
              isOnSale={product.isOnSale}
              discount={product.discount}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron productos</p>
          <p className="text-gray-400 text-sm mt-2">
            Intenta ajustar los filtros o categorías seleccionadas
          </p>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            const isCurrentPage = page === currentPage;
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                  isCurrentPage
                    ? "bg-campomaq text-black border-campomaq"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
