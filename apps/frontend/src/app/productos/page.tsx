"use client";

import { useState, useMemo, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CategorySidebar from "./components/CategorySidebar";
import CategoryMenuMobile from "./components/CategoryMenuMobile";
import WeeklyOffer from "./components/WeeklyOffer";
import PopularProducts from "./components/PopularProducts";
import TrendingProducts from "./components/TrendingProducts";
import AllProducts from "./components/AllProducts";
import SearchResults from "./components/SearchResults";
import ProductTabs from "./components/ProductTabs";
import Breadcrumb from "./components/Breadcrumb";
import CardProducto from "@/app/components/ui/CardProducto";
import { products } from "./data/products";
import { ChevronDown } from "lucide-react";
import { Product, FilterState } from "./types";
import { ProductService, getFallbackProducts, handleApiError } from "./services/productService";

export default function ProductosPage() {
  // Estado centralizado para filtros
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    showSearchResults: false,
    activeTab: "all",
    selectedCategory: "",
    selectedBrand: "",
    sortBy: "name",
    showPriceFilters: false,
    showBrandFilters: false,
  });

  // Estado para manejo de datos y carga
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener categorías y marcas únicas
  const categories = useMemo(() => {
    return [...new Set(allProducts.map(p => p.category))];
  }, [allProducts]);

  const brands = useMemo(() => {
    return [...new Set(allProducts.map(p => p.brand).filter(Boolean))];
  }, [allProducts]);

  // Función para cargar productos desde la API
  const loadProductsFromAPI = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Intentar cargar desde la API
      const response = await ProductService.getProducts();
      setAllProducts(response.data);
    } catch (apiError) {
      // Si falla la API, usar datos locales como fallback
      console.warn('API not available, using local data:', apiError);
      setAllProducts(getFallbackProducts());
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProductsFromAPI();
  }, []);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filtrar por categoría
    if (filters.selectedCategory) {
      filtered = filtered.filter(p => p.category === filters.selectedCategory);
    }

    // Filtrar por marca
    if (filters.selectedBrand) {
      filtered = filtered.filter(p => p.brand === filters.selectedBrand);
    }

    // Aplicar filtros según la pestaña activa
    switch (filters.activeTab) {
      case "ofertas":
        filtered = filtered.filter(p => p.isOnSale);
        break;
      case "tendencia":
        const trendingIds = ["3", "5", "7", "9", "11", "12"];
        filtered = filtered.filter(p => trendingIds.includes(p.id));
        break;
      case "nuevos":
        filtered = filtered.filter(p => p.isNew);
        break;
      case "all":
      default:
        // Mostrar todos los productos
        break;
    }

    // Ordenar productos
    switch (filters.sortBy) {
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
  }, [filters.activeTab, filters.selectedCategory, filters.selectedBrand, filters.sortBy, allProducts]);

  // Función para actualizar filtros
  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  // Manejadores de eventos
  const handleSearch = (query: string) => {
    if (query.trim()) {
      updateFilters({
        searchQuery: query.trim(),
        showSearchResults: true,
      });
    } else {
      updateFilters({
        searchQuery: "",
        showSearchResults: false,
      });
    }
  };

  const handleBackFromSearch = () => {
    updateFilters({
      showSearchResults: false,
      searchQuery: "",
    });
  };

  const handleTabChange = (tab: string) => {
    updateFilters({
      activeTab: tab,
      selectedCategory: "",
      selectedBrand: "",
    });
  };

  const handleCategoryClick = (category: string) => {
    updateFilters({
      selectedCategory: category,
      selectedBrand: "",
      activeTab: "all",
    });
  };

  const handleBrandClick = (brand: string | undefined) => {
    if (brand) {
      updateFilters({
        selectedBrand: brand,
        selectedCategory: "",
        activeTab: "all",
      });
    }
  };

  const getBreadcrumbItems = () => {
    if (filters.showSearchResults) {
      return [
        { label: "Productos", href: "/productos" },
        { label: `Búsqueda: "${filters.searchQuery}"`, isActive: true }
      ];
    }

    const items = [];
    if (filters.selectedCategory) {
      items.push({ label: filters.selectedCategory, isActive: true });
    } else if (filters.selectedBrand) {
      items.push({ label: filters.selectedBrand, isActive: true });
    } else {
      const tabLabels = {
        "ofertas": "Ofertas",
        "tendencia": "Tendencia", 
        "nuevos": "Nuevos",
        "all": "Todos los Productos"
      };
      items.push({ label: tabLabels[filters.activeTab as keyof typeof tabLabels] || "Productos", isActive: true });
    }

    return items;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-24">
      {/* Sidebar en desktop */}
      <aside className="hidden md:block w-64 bg-white border-r">
        <CategorySidebar />
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* SearchBar fijo */}
        <div className="sticky top-24 bg-white z-20 p-4 border-b">
          {/* Menú lateral + barra de búsqueda en móviles */}
          <div className="md:hidden flex items-center gap-2 mb-4">
            <CategoryMenuMobile />
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Barra de búsqueda en desktop */}
          <div className="hidden md:block">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Breadcrumb */}
          <Breadcrumb items={getBreadcrumbItems()} />

          {/* Indicador de carga */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-campomaq"></div>
              <span className="ml-2 text-gray-600">Cargando productos...</span>
            </div>
          )}

          {/* Manejo de errores */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">Error: {error}</p>
              <button
                onClick={loadProductsFromAPI}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {filters.showSearchResults ? (
                <SearchResults 
                  searchQuery={filters.searchQuery} 
                  onBack={handleBackFromSearch} 
                />
              ) : (
                <>
                  {/* Filtros debajo del search */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Botón Ofertas */}
                      <button
                        onClick={() => handleTabChange("ofertas")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          filters.activeTab === "ofertas"
                            ? "bg-red-100 text-red-800 ring-2 ring-offset-2 ring-campomaq"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        Ofertas
                      </button>

                      {/* Botón Tendencia */}
                      <button
                        onClick={() => handleTabChange("tendencia")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          filters.activeTab === "tendencia"
                            ? "bg-purple-100 text-purple-800 ring-2 ring-offset-2 ring-campomaq"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        Tendencia
                      </button>

                      {/* Botón Nuevos */}
                      <button
                        onClick={() => handleTabChange("nuevos")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          filters.activeTab === "nuevos"
                            ? "bg-green-100 text-green-800 ring-2 ring-offset-2 ring-campomaq"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        Nuevos
                      </button>

                      {/* Botón deslizante para filtros de precio */}
                      <div className="relative">
                        <button
                          onClick={() => updateFilters({ showPriceFilters: !filters.showPriceFilters })}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-200"
                        >
                          Filtro x precios
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${filters.showPriceFilters ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {filters.showPriceFilters && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                            <div className="space-y-2">
                              <button
                                onClick={() => {
                                  updateFilters({ sortBy: "price-low", showPriceFilters: false });
                                }}
                                className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                              >
                                Menos caro
                              </button>
                              <button
                                onClick={() => {
                                  updateFilters({ sortBy: "price-high", showPriceFilters: false });
                                }}
                                className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                              >
                                Más caro
                              </button>
                              <button
                                onClick={() => {
                                  updateFilters({ sortBy: "name", showPriceFilters: false });
                                }}
                                className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                              >
                                Por nombre
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Botón deslizante para filtros de marcas */}
                      <div className="relative">
                        <button
                          onClick={() => updateFilters({ showBrandFilters: !filters.showBrandFilters })}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-200"
                        >
                          Filtro por marcas
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${filters.showBrandFilters ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {filters.showBrandFilters && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 max-h-60 overflow-y-auto">
                            <div className="space-y-2">
                              {brands.map((brand) => (
                                <button
                                  key={brand}
                                  onClick={() => {
                                    handleBrandClick(brand);
                                    updateFilters({ showBrandFilters: false });
                                  }}
                                  className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                                >
                                  {brand}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Botón Todos */}
                      <button
                        onClick={() => handleTabChange("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          filters.activeTab === "all"
                            ? "bg-campomaq text-black ring-2 ring-offset-2 ring-campomaq"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        Todos
                      </button>
                    </div>
                  </div>

                  {/* Resultados */}
                  <div className="mb-4">
                    <p className="text-gray-600">
                      Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Grid de productos */}
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="relative">
                          <CardProducto
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
                            description={product.description}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No se encontraron productos</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Intenta ajustar los filtros seleccionados
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
