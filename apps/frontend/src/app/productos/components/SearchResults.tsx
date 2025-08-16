"use client";

import { useState, useEffect } from "react";
import CardProducto from "@/app/components/ui/CardProducto";
import { searchProducts, getRelatedProducts, Product } from "../data/products";
import { Search, ArrowLeft } from "lucide-react";

interface SearchResultsProps {
  searchQuery: string;
  onBack: () => void;
}

export default function SearchResults({ searchQuery, onBack }: SearchResultsProps) {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchProducts(searchQuery);
      setSearchResults(results);
      
      // Si hay resultados, obtener productos relacionados del primer resultado
      if (results.length > 0) {
        const related = getRelatedProducts(results[0].id, 4);
        setRelatedProducts(related);
      } else {
        setRelatedProducts([]);
      }
    } else {
      setSearchResults([]);
      setRelatedProducts([]);
    }
  }, [searchQuery]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    const related = getRelatedProducts(product.id, 4);
    setRelatedProducts(related);
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
      {searchResults.length > 0 ? (
        <div className="space-y-8">
          {/* Productos encontrados */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Productos Encontrados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="cursor-pointer"
                >
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
          </section>

          {/* Productos relacionados */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Productos Relacionados
                {selectedProduct && (
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    con &quot;{selectedProduct.name}&quot;
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
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
                    description={product.description}
                  />
                ))}
              </div>
            </section>
          )}
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
              <li>• Usa sinónimos o términos relacionados</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
