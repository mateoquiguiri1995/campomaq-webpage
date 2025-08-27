import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Star, Shield, Truck, ArrowLeft } from 'lucide-react';

// Types defined inline
interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  brand?: string;
  brandLogo?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  description?: string;
  tags?: string[];
  additionalImages?: string[];
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Reset image index when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setIsImageLoading(true);
    }
  }, [product]);

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const images = product.additionalImages && product.additionalImages.length > 0 
    ? product.additionalImages 
    : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsImageLoading(true);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsImageLoading(true);
  };

  const formatDescription = (description: string) => {
    if (!description) return '';
    
    return description
      .split('\n')
      .map((line, index) => {
        const trimmedLine = line.trim();
        
        // Handle headers (lines starting with **)
        if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
          const text = trimmedLine.replace(/\*\*/g, '').trim();
          if (text.includes(':')) {
            return (
              <h3 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-200">
                {text}
              </h3>
            );
          }
          return (
            <h4 key={index} className="text-md font-semibold text-gray-800 mt-4 mb-2">
              {text}
            </h4>
          );
        }
        
        // Handle bullet points (lines starting with -)
        if (trimmedLine.startsWith('- ')) {
          const text = trimmedLine.replace(/^-\s*/, '').trim();
          return (
            <li key={index} className="text-gray-700 mb-1 pl-2 list-disc list-inside">
              {text}
            </li>
          );
        }
        
        // Handle regular paragraphs
        if (trimmedLine) {
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-3">
              {trimmedLine}
            </p>
          );
        }
        
        return null;
      })
      .filter(Boolean);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl max-h-[90vh] w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {product.brandLogo && (
                  <img 
                    src={product.brandLogo} 
                    alt={product.brand} 
                    className="h-6 w-auto object-contain"
                  />
                )}
                <span className="text-gray-600 font-medium">{product.brand}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-88px)]">
          {/* Image Gallery */}
          <div className="lg:w-1/2 relative bg-gray-50">
            <div className="aspect-square relative overflow-hidden">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              <img
                src={images[currentImageIndex]}
                alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
                className="w-full h-full object-contain p-8"
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Product Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Nuevo
                  </span>
                )}
                {product.isOnSale && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsImageLoading(true);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-contain bg-white"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              {/* Category and Rating */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                </div>
              </div>

              {/* Product Description */}
              <div className="prose prose-sm max-w-none">
                <div className="space-y-2">
                  {formatDescription(product.description || '')}
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Etiquetas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Garantía</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Envío</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span>Calidad</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
                  Solicitar Cotización
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;