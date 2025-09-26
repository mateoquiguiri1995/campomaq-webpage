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
import Image from "next/image";
import { availableBrands } from "./components/brands";
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
  const tabFromURL = searchParams.get('tab');

  // Estado centralizado para filtros con modo de navegación
  const [filters, setFilters] = useState<ExtendedFilterState>({
    searchQuery: searchFromURL || "",
    showSearchResults: !!searchFromURL,
    activeTab: tabFromURL || "all",
    selectedCategory: categoryFromURL || "",
    selectedBrand: brandFromURL || "",
    sortBy: "name",
    showPriceFilters: false,
    showBrandFilters: false,
    navigationMode: "tab"
  });

  // Estado para manejo de datos y carga
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para productos de API - TODOS los productos
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  // UI loading state para mantener el spinner hasta que la UI termine de pintar
  const [uiLoading, setUiLoading] = useState(false);

  // Mantener un pequeño periodo de gracia tras el fin de la carga de la API
  // para asegurar que los productos e imágenes estén listos antes de ocultar el spinner
  useEffect(() => {
    if (apiLoading) {
      setUiLoading(true);
      return;
    }
    let rafId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(() => setUiLoading(false), 250);
    });

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, [apiLoading]);

  // Estado para el modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener marcas desde la configuración estática

  // Función para cargar TODOS los productos una sola vez
  const loadAllProducts = useCallback(async () => {
    setApiLoading(true);
    setError(null);
    try {
      console.log("[loadAllProducts] Cargando todos los productos...");
      const results = await ProductService.getAllProducts();
      console.log("[loadAllProducts] Productos cargados:", results.length);
      setAllProducts(results);
    } catch (error) {
      console.error('Error loading all products:', error);
      setAllProducts([]);
      setError('Error al cargar productos');
    } finally {
      setApiLoading(false);
    }
  }, []);

  // Función para cargar productos por marca usando la API
  const loadProductsByBrand = useCallback(async (brand: string) => {
    setApiLoading(true);
    setError(null);
    try {
      console.log("[loadProductsByBrand] Buscando productos de marca:", brand);
      const results = await ProductService.searchProducts(brand);
      console.log("[loadProductsByBrand] Productos encontrados:", results.length);
      setAllProducts(results);
    } catch (error) {
      console.error('Error loading products by brand:', error);
      setAllProducts([]);
      setError('Error al cargar productos por marca');
    } finally {
      setApiLoading(false);
    }
  }, []);

  // Función para cargar productos por categoría usando la API
  const loadProductsByCategory = useCallback(async (category: string) => {
    setApiLoading(true);
    setError(null);
    try {
      console.log("[loadProductsByCategory] Buscando productos de categoría:", category);
      const results = await ProductService.searchProducts(category);
      console.log("[loadProductsByCategory] Productos encontrados:", results.length);
      setAllProducts(results);
    } catch (error) {
      console.error('Error loading products by category:', error);
      setAllProducts([]);
      setError('Error al cargar productos por categoría');
    } finally {
      setApiLoading(false);
    }
  }, []);

  // Efecto inicial para cargar productos
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
      
      loadProductsByCategory(categoryFromURL);
    } else {
      // Cargar todos los productos para los filtros por tabs
      const initialTab = tabFromURL || "all";
      setFilters(prev => ({
        ...prev,
        activeTab: initialTab,
        navigationMode: "tab"
      }));
      loadAllProducts();
    }
  }, [brandFromURL, searchFromURL, categoryFromURL, tabFromURL, loadAllProducts, loadProductsByBrand, loadProductsByCategory]);

  // Productos filtrados - APLICAR FILTROS LOCALMENTE
  const filteredProducts = useMemo(() => {
    console.log("[filteredProducts] Modo de navegación:", filters.navigationMode);
    console.log("[filteredProducts] Productos disponibles:", allProducts.length);
    console.log("[filteredProducts] Tab activo:", filters.activeTab);

    // Si estamos en modo de navegación por marca, categoría o búsqueda, usar todos los productos cargados
    if (filters.navigationMode === "brand" || filters.navigationMode === "category") {
      return allProducts;
    }

    // Para el modo tab, aplicar filtros locales
    if (filters.navigationMode === "tab") {
      let filtered = [...allProducts];

      switch (filters.activeTab) {
        case "ofertas":
          console.log("[filteredProducts] Filtrando ofertas...");
          filtered = allProducts.filter(product => {
            const hasDiscount = product.discount && product.discount > 0;
            console.log(`Producto: ${product.name}, Descuento: ${product.discount}, Tiene descuento: ${hasDiscount}`);
            return hasDiscount;
          });
          console.log("[filteredProducts] Ofertas encontradas:", filtered.length);
          break;
          
        case "tendencia":
          console.log("[filteredProducts] Filtrando tendencias...");
          // Para tendencias, podemos usar productos con ciertas características
          // o simplemente mostrar los primeros productos como ejemplo
          filtered = allProducts.slice(0, Math.min(20, allProducts.length));
          console.log("[filteredProducts] Productos en tendencia:", filtered.length);
          break;
          
        case "nuevos":
          console.log("[filteredProducts] Filtrando nuevos...");
          filtered = allProducts.filter(product => {
            const isNew = product.isNew === true;
            console.log(`Producto: ${product.name}, Es nuevo: ${isNew}`);
            return isNew;
          });
          console.log("[filteredProducts] Productos nuevos encontrados:", filtered.length);
          break;
          
        case "all":
        default:
          console.log("[filteredProducts] Mostrando todos los productos (limitado a 30)");
          filtered = allProducts.slice(0, 30); // Limitar a 30 productos
          break;
      }

      return filtered;
    }

    return allProducts;
  }, [allProducts, filters.navigationMode, filters.activeTab]);

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

  // Manejadores de eventos
  const handleResetToAll = useCallback(() => {
    updateFilters({
      showSearchResults: false,
      searchQuery: "",
      selectedCategory: "",
      selectedBrand: "",
      activeTab: "all",
      navigationMode: "tab"
    });
    
    router.replace('/productos', { scroll: false });
    loadAllProducts();
  }, [updateFilters, router, loadAllProducts]);

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
    console.log("[handleTabChange] Cambiando a tab:", tab);
    
    updateFilters({
      activeTab: tab,
      selectedCategory: "",
      selectedBrand: "",
      showSearchResults: false,
      searchQuery: "",
      navigationMode: "tab"
    });
    
    // Actualizar URL
    if (tab !== "all") {
      const params = new URLSearchParams();
      params.set('tab', tab);
      router.replace(`/productos?${params.toString()}`, { scroll: false });
    } else {
      router.replace('/productos', { scroll: false });
    }
    
    // Solo cargar productos si no los tenemos o estamos cambiando de modo de navegación
    if (allProducts.length === 0 || filters.navigationMode !== "tab") {
      loadAllProducts();
    }
    // Si ya tenemos productos y estamos en modo tab, no hacer nada más (filtrado instantáneo)
  }, [updateFilters, router, allProducts.length, filters.navigationMode, loadAllProducts]);

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
      
      // Filtrar productos por marca localmente sin loading
      const brandProducts = allProducts.filter(product =>
        product.brand && product.brand.toLowerCase().includes(brand.toLowerCase())
      );
      
      // Si encontramos productos localmente, usarlos
      if (brandProducts.length > 0) {
        setAllProducts(brandProducts);
      } else {
        // Solo si no encontramos productos localmente, hacer búsqueda en API
        loadProductsByBrand(brand);
      }
      
      const params = new URLSearchParams();
      params.set('brand', brand);
      router.replace(`/productos?${params.toString()}`, { scroll: false });
    }
  }, [updateFilters, router, allProducts, loadProductsByBrand]);

  // Función para breadcrumbs
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

  const showLoading = apiLoading || uiLoading;

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

          {/* Indicador de carga - Solo para búsquedas y categorías */}
          {showLoading && (
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
                onClick={() => {
                  setError(null);
                  handleResetToAll();
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {!showLoading && !error && (
            <>
              {filters.showSearchResults ? (
                <SearchResults 
                  searchQuery={filters.searchQuery} 
                  onBack={handleBackFromSearch} 
                />
              ) : (
                <>
                  {/* Filtros debajo del search */}
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

                        {/* Filtro de marcas mejorado */}
                        <div className="relative">
                          <button
                            onClick={() => updateFilters({ showBrandFilters: !filters.showBrandFilters })}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-200"
                          >
                            Filtro por marcas
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${filters.showBrandFilters ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {filters.showBrandFilters && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 max-h-60 overflow-y-auto">
                              <div className="space-y-2">
                                {availableBrands.map((brand) => (
                                  <button
                                    key={brand.id}
                                    onClick={() => {
                                      handleBrandClick(brand.name);
                                      updateFilters({ showBrandFilters: false });
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                                  >
                                    {brand.logo && (
                                      <Image
                                        src={brand.logo}
                                        alt={brand.name}
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                      />
                                    )}
                                    <span>{brand.name}</span>
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
                      {filters.navigationMode === "tab" && filters.activeTab !== "all" && (
                        <span className="text-gray-600 font-medium"> - {
                          filters.activeTab === "ofertas" ? "Ofertas" :
                          filters.activeTab === "tendencia" ? "En Tendencia" :
                          filters.activeTab === "nuevos" ? "Productos Nuevos" : ""
                        }</span>
                      )}
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
                        {filters.activeTab === "ofertas" ? "No hay productos con ofertas disponibles" :
                         filters.activeTab === "nuevos" ? "No hay productos nuevos disponibles" :
                         filters.activeTab === "tendencia" ? "No hay productos en tendencia disponibles" :
                         "Intenta ajustar los filtros seleccionados"}
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