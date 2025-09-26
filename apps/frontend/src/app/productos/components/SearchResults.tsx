"use client";

import { useState, useEffect } from "react";
import CardProducto from "@/app/components/ui/CardProducto";
import { ProductService } from "../services/productService";
import { Product } from "../types"; 
import { Search, ArrowLeft } from "lucide-react";
import ProductModal from "./ProductDetailModal";

interface SearchResultsProps {
  searchQuery: string;
  onBack: () => void;
}

export default function SearchResults({ searchQuery, onBack }: SearchResultsProps) {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchSearchResults = async () => {
      const q = searchQuery.trim();
      if (!q) {
        setSearchResults([]);
        setSelectedProduct(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await ProductService.searchProducts(q);
        if (!cancelled) {
          setSearchResults(results);
          setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Error searching products:', error);
        if (!cancelled) {
          setSearchResults([]);
          setSelectedProduct(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchSearchResults();
    return () => { cancelled = true; };
  }, [searchQuery]);

  // Función para manejar el click en un producto
  const handleProductClick = async (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-8">
      {/* Header de búsqueda */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-gray-600">
            <Search className="w-4 h-4" />
            <span>Resultados para: </span>
            <span className="font-semibold text-gray-900">&quot;{searchQuery}&quot;</span>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {searchResults.length} producto{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Resultados de búsqueda */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Buscando productos...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-8">
          {/* Productos encontrados */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Productos Encontrados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="cursor-pointer"
                >
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
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* No se encontraron resultados */
        <div className="text-center py-12">
          <div className="mb-4">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 mb-6">
            No encontramos productos que coincidan con &quot;{searchQuery}&quot;.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Sugerencias:</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Verifica que las palabras estén escritas correctamente</li>
              <li>• Intenta con términos más generales</li>
              
            </ul>
          </div>
        </div>
      )}

      {/* Modal de producto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}