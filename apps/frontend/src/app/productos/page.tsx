"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import CategorySidebar from "./components/CategorySidebar";
import CategoryMenuMobile from "./components/CategoryMenuMobile";
import SearchResults from "./components/SearchResults";
import Breadcrumb from "./components/Breadcrumb";
import CardProducto from "@/app/components/ui/CardProducto";
import ProductModal from "./components/ProductDetailModal";
import { ChevronDown } from "lucide-react";
import { Product, FilterState } from "./types";
import { ProductService } from "./services/productService";
import { useSearchParams, useRouter } from "next/navigation";

// Definir los tipos de modo de navegación
type NavigationMode = "search" | "brand" | "category" | "tab";

interface ExtendedFilterState extends FilterState {
  navigationMode: NavigationMode;
}

// Componente interno con Suspense
function ProductosPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Detectar el tipo de navegación basado en los parámetros URL
  const brandFromURL = searchParams.get('brand');
  const searchFromURL = searchParams.get('search');
  const categoryFromURL = searchParams.get('category');

  // Estado centralizado para filtros con modo de navegación
  const [filters, setFilters] = useState<ExtendedFilterState>({
    searchQuery: searchFromURL || "",
    showSearchResults: !!searchFromURL,
    activeTab: "all",
    selectedCategory: categoryFromURL || "",
    selectedBrand: brandFromURL || "",
    sortBy: "name",
    showPriceFilters: false,
    showBrandFilters: false,
    navigationMode: "tab"
  });

  // Estado para manejo de datos y carga
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para productos de API cuando filtramos por marca/categoría
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [apiLoading, setApiLoading] = useState(false);

  // Estado para el modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener marcas únicas
  const brands = useMemo(() => {
    return [...new Set(allProducts.map(p => p.brand).filter(Boolean))];
  }, [allProducts]);

  // Función para cargar productos por marca usando la API
  const loadProductsByBrand = async (brand: string) => {
    setApiLoading(true);
    try {
      const results = await ProductService.searchProducts(brand);
      setApiProducts(results);
    } catch (error) {
      console.error('Error loading products by brand:', error);
      setApiProducts([]);
    } finally {
      setApiLoading(false);
    }
  };

  // Función para cargar productos por categoría usando la API
  const loadProductsByCategory = async (category: string) => {
    setApiLoading(true);
    try {
      const results = await ProductService.searchProducts(category);
      setApiProducts(results);
    } catch (error) {
      console.error('Error loading products by category:', error);
      setApiProducts([]);
    } finally {
      setApiLoading(false);
    }
  };

  // Efecto para cargar todos los productos al montar el componente
  useEffect(() => {
    const loadAllProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const products = await ProductService.getAllProducts(20);
        setAllProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Error al cargar los productos');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllProducts();
  }, []);

  // Efecto para determinar el modo de navegación y cargar datos de API cuando sea necesario
  useEffect(() => {
    let newMode: NavigationMode = "tab";
    
    if (brandFromURL) {
      newMode = "brand";
      setFilters(prev => ({
        ...prev,
        selectedBrand: brandFromURL,
        selectedCategory: "",
        searchQuery: "",
        showSearchResults: false,
        activeTab: "all",
        navigationMode: newMode
      }));
      
      // Cargar productos de la marca usando la API
      loadProductsByBrand(brandFromURL);
      
    } else if (searchFromURL) {
      newMode = "search";
      setFilters(prev => ({
        ...prev,
        searchQuery: searchFromURL,
        showSearchResults: true,
        selectedCategory: "",
        selectedBrand: "",
        activeTab: "all",
        navigationMode: newMode
      }));
    } else if (categoryFromURL) {
      newMode = "category";
      setFilters(prev => ({
        ...prev,
        selectedCategory: categoryFromURL,
        selectedBrand: "",
        searchQuery: "",
        showSearchResults: false,
        activeTab: "all",
        navigationMode: newMode
      }));
      
      // Cargar productos de la categoría usando la API
      loadProductsByCategory(categoryFromURL);
    }
  }, [brandFromURL, searchFromURL, categoryFromURL]);

  // Filtrar productos - ahora considerando productos de API cuando sea necesario
  const filteredProducts = useMemo(() => {
    // Si estamos en modo brand o category y tenemos productos de API, usar esos
    if ((filters.navigationMode === "brand" || filters.navigationMode === "category") && apiProducts.length > 0) {
      return apiProducts;
    }
    
    // De lo contrario, usar la lógica de filtros local
    let filtered = allProducts;

    if (filters.selectedCategory) {
      filtered = filtered.filter(p => p.category === filters.selectedCategory);
    }

    if (filters.selectedBrand) {
      filtered = filtered.filter(p => p.brand === filters.selectedBrand);
    }

    switch (filters.activeTab) {
      case "ofertas":
        filtered = filtered.filter(p => (p.discount ?? 0) > 0);
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
        break;
    }
    
    return filtered;
  }, [filters.activeTab, filters.selectedCategory, filters.selectedBrand, allProducts, apiProducts, filters.navigationMode]);

  // Funciones para el modal
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Función para actualizar filtros
  const updateFilters = useCallback((updates: Partial<ExtendedFilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  // Nueva función para resetear a "Todos los productos" - definida primero
  const handleResetToAll = useCallback(() => {
    updateFilters({
      showSearchResults: false,
      searchQuery: "",
      selectedCategory: "",
      selectedBrand: "",
      activeTab: "all",
      navigationMode: "tab"
    });
    
    // Limpiar productos de API
    setApiProducts([]);
    
    // Limpiar URL
    router.replace('/productos', { scroll: false });
  }, [updateFilters, router]);

  // Manejadores de eventos
  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      updateFilters({
        searchQuery: query.trim(),
        showSearchResults: true,
        selectedCategory: "",
        selectedBrand: "",
        activeTab: "all",
        navigationMode: "search"
      });
      
      // Actualizar URL para búsqueda
      const params = new URLSearchParams();
      params.set('search', query.trim());
      router.replace(`/productos?${params.toString()}`, { scroll: false });
    } else {
      handleResetToAll();
    }
  }, [updateFilters, router, handleResetToAll]);

  const handleBackFromSearch = useCallback(() => {
    handleResetToAll();
  }, [handleResetToAll]);

  const handleTabChange = useCallback((tab: string) => {
    updateFilters({
      activeTab: tab,
      selectedCategory: "",
      selectedBrand: "",
      showSearchResults: false,
      searchQuery: "",
      navigationMode: "tab"
    });
    
    // Limpiar productos de API al cambiar de tab
    setApiProducts([]);
    
    // Actualizar URL si no es "all"
    if (tab !== "all") {
      const params = new URLSearchParams();
      params.set('tab', tab);
      router.replace(`/productos?${params.toString()}`, { scroll: false });
    } else {
      router.replace('/productos', { scroll: false });
    }
  }, [updateFilters, router]);

  const handleBrandClick = useCallback((brand: string | undefined) => {
    if (brand) {
      updateFilters({
        selectedBrand: brand,
        selectedCategory: "",
        activeTab: "all",
        showSearchResults: false,
        searchQuery: "",
        navigationMode: "brand"
      });
      
      // Cargar productos de la marca usando la API
      loadProductsByBrand(brand);
      
      // Actualizar URL para marca
      const params = new URLSearchParams();
      params.set('brand', brand);
      router.replace(`/productos?${params.toString()}`, { scroll: false });
    }
  }, [updateFilters, router]);

  // Función mejorada para breadcrumbs
  const getBreadcrumbItems = useCallback(() => {
    const items = [];

    switch (filters.navigationMode) {
      case "search":
        if (filters.searchQuery) {
          items.push({ 
            label: `Búsqueda: "${filters.searchQuery}"`, 
            isActive: true 
          });
        }
        break;
        
      case "brand":
        if (filters.selectedBrand) {
          items.push({ 
            label: filters.selectedBrand, 
            isActive: true 
          });
        }
        break;
        
      case "category":
        if (filters.selectedCategory) {
          items.push({ 
            label: filters.selectedCategory, 
            isActive: true 
          });
        }
        break;
        
      case "tab":
      default:
        const tabLabels = {
          "ofertas": "Ofertas",
          "tendencia": "Tendencia", 
          "nuevos": "Nuevos",
          "all": "Todos los Productos"
        };
        items.push({ 
          label: tabLabels[filters.activeTab as keyof typeof tabLabels] || "Todos los Productos", 
          isActive: true 
        });
        break;
    }

    return items;
  }, [filters.navigationMode, filters.searchQuery, filters.selectedBrand, filters.selectedCategory, filters.activeTab]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-24">
      {/* Sidebar en desktop */}
      <aside className="sticky hidden md:block w-64 bg-white pt-8 top-31 py-4 self-start overflow-y-auto">
        <CategorySidebar />
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* SearchBar fijo */}
        <div className="top-40 pt-15 bg-white z-20 p-4">
          {/* Menú lateral + barra de búsqueda en móviles */}
          <div className="md:hidden flex items-center gap-2 mb-4 pt-5">
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
          <Breadcrumb 
            items={getBreadcrumbItems()} 
            onProductsClick={handleResetToAll}
          />

          {/* Indicador de carga */}
          {(isLoading || apiLoading) && (
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
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && !apiLoading && !error && (
            <>
              {filters.showSearchResults ? (
                <SearchResults 
                  searchQuery={filters.searchQuery} 
                  onBack={handleBackFromSearch} 
                />
              ) : (
                <>
                  {/* Filtros debajo del search - Solo mostrar si no estamos en modo búsqueda */}
                  {filters.navigationMode !== "search" && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Botón Ofertas */}
                        <button
                          onClick={() => handleTabChange("ofertas")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            filters.activeTab === "ofertas"
                              ? "bg-red-100 text-red-800 ring-2 ring-offset-2 ring-campomaq"
                              : "bg-white text-gray-700 hover:bg-campomaq/40 border border-gray-200 cursor-pointer"
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
                              : "bg-white text-gray-700 hover:bg-campomaq/40 border border-gray-200 cursor-pointer"
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
                              : "bg-white text-gray-700 hover:bg-campomaq/40 border border-gray-200 cursor-pointer"
                          }`}
                        >
                          Nuevos
                        </button>

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
                            filters.activeTab === "all" && filters.navigationMode === "tab"
                              ? "bg-campomaq text-black ring-2 ring-offset-2 ring-campomaq"
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          Todos
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Resultados */}
                  <div className="mb-4">
                    <p className="text-gray-600">
                      Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Grid de productos */}
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="relative">
                          <div onClick={() => handleProductClick(product)} className="cursor-pointer">
                            <CardProducto
                              id={product.id}
                              name={product.name}
                              image={product.image}
                              category={product.category}
                              brand={product.brand}
                              brandLogo={product.brandLogo}
                              isNew={product.isNew}
                              discount={product.discount}
                              description={product.description}
                            />
                          </div>
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

      {/* Modal de producto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

// Componente principal con Suspense wrapper
export default function ProductosPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-campomaq"></div>
        <span className="ml-2 text-gray-600">Cargando...</span>
      </div>
    }>
      <ProductosPageContent />
    </Suspense>
  );
}