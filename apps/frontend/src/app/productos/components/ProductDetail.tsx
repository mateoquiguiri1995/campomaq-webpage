{/*import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Truck, Shield, Info, Book, Wrench, Camera } from 'lucide-react';
import { Product } from '../types';
import CardProducto from '@/app/components/ui/CardProducto';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  onBack: () => void;
  onProductClick?: (productId: string) => void;
}

interface ProductDetailData extends Product {
  // Campos adicionales que pueden venir de la API
  specifications?: { [key: string]: string };
  technicalGuide?: string;
  usabilityRecommendations?: string[];
  components?: string[];
  additionalImages?: string[];
  longDescription?: string;
  warranty?: string;
  availability?: string;
  rating?: number;
  reviews?: number;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  relatedProducts, 
  onBack,
  onProductClick 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [detailedProduct, setDetailedProduct] = useState<ProductDetailData>(product);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Simular carga de datos adicionales del producto desde API
  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      try {
        // llamada real a la API
        // const response = await ProductService.getProductDetails(product.id);
        
        // Por ahora simulamos datos adicionales
        const additionalData: Partial<ProductDetailData> = {
          specifications: {
            'Peso': '15 kg',
            'Dimensiones': '100 x 50 x 30 cm',
            'Material': 'Acero inoxidable',
            'Potencia': '2.5 HP'
          },
          technicalGuide: 'Guía técnica completa disponible en PDF',
          usabilityRecommendations: [
            'Usar en superficies planas y estables',
            'Realizar mantenimiento cada 3 meses',
            'No exponer a temperaturas extremas'
          ],
          components: [
            'Motor principal',
            'Sistema de transmisión',
            'Panel de control',
            'Kit de herramientas'
          ],
          additionalImages: [
            product.image,
            '/images/product-detail-2.jpg',
            '/images/product-detail-3.jpg'
          ],
          longDescription: 'Descripción detallada del producto con todas sus características técnicas y beneficios...',
          warranty: '2 años de garantía',
          availability: 'En stock',
          rating: 4.5,
          reviews: 128
        };

        setDetailedProduct(prev => ({ ...prev, ...additionalData }));
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [product.id]);

  const images = detailedProduct.additionalImages || [product.image];

  const tabs = [
    { id: 'description', label: 'Descripción', icon: Info },
    { id: 'specifications', label: 'Especificaciones', icon: Book },
    { id: 'components', label: 'Componentes', icon: Wrench },
    { id: 'guide', label: 'Guía Técnica', icon: Book }
  ].filter(tab => {
    // Filtrar tabs basado en datos disponibles
    if (tab.id === 'specifications' && !detailedProduct.specifications) return false;
    if (tab.id === 'components' && !detailedProduct.components) return false;
    if (tab.id === 'guide' && !detailedProduct.technicalGuide) return false;
    return true;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              {detailedProduct.longDescription || detailedProduct.description}
            </p>
            {detailedProduct.usabilityRecommendations && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recomendaciones de uso:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {detailedProduct.usabilityRecommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'specifications':
        return detailedProduct.specifications ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(detailedProduct.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-900">{key}:</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        ) : null;
      
      case 'components':
        return detailedProduct.components ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {detailedProduct.components.map((component, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <Wrench className="w-4 h-4 text-campomaq" />
                <span className="text-gray-700">{component}</span>
              </div>
            ))}
          </div>
        ) : null;
      
      case 'guide':
        return detailedProduct.technicalGuide ? (
          <div className="text-center py-8">
            <Book className="w-16 h-16 text-campomaq mx-auto mb-4" />
            <p className="text-gray-700 mb-4">{detailedProduct.technicalGuide}</p>
            <button className="bg-campomaq text-white px-6 py-2 rounded-lg hover:bg-campomaq/90 transition-colors">
              Descargar PDF
            </button>
          </div>
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Botón de volver 
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-campomaq hover:text-campomaq/80 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Volver a productos
      </button>

      {/* Card de producto seleccionado 
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Galería de imágenes 
          <div className="space-y-4">
            {/* Imagen principal 
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[selectedImageIndex]}
                alt={detailedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Miniaturas 
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-campomaq' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${detailedProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto 
          <div className="space-y-6">
            {/* Encabezado 
            <div>
              <div className="flex items-center gap-2 mb-2">
                {detailedProduct.brandLogo && (
                  <img 
                    src={detailedProduct.brandLogo} 
                    alt={detailedProduct.brand}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <span className="text-sm text-gray-600">{detailedProduct.brand}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {detailedProduct.name}
              </h1>
              <p className="text-gray-600">{detailedProduct.category}</p>
            </div>

            {/* Rating y reviews si están disponibles 
            {detailedProduct.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(detailedProduct.rating!)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {detailedProduct.rating} ({detailedProduct.reviews} reseñas)
                </span>
              </div>
            )}

            {/* Precio 
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${detailedProduct.price.toLocaleString()}
                </span>
                {detailedProduct.originalPrice && detailedProduct.originalPrice > detailedProduct.price && (
                  <span className="text-lg text-gray-500 line-through">
                    ${detailedProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                {detailedProduct.discount && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    -{detailedProduct.discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Estado y garantía 
            <div className="flex flex-wrap gap-4 text-sm">
              {detailedProduct.availability && (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {detailedProduct.availability}
                </div>
              )}
              {detailedProduct.warranty && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Shield className="w-4 h-4" />
                  {detailedProduct.warranty}
                </div>
              )}
              <div className="flex items-center gap-1 text-gray-600">
                <Truck className="w-4 h-4" />
                Envío gratis
              </div>
            </div>

            {/* Badges 
            <div className="flex flex-wrap gap-2">
              {detailedProduct.isNew && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  Nuevo
                </span>
              )}
              {detailedProduct.isOnSale && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                  En Oferta
                </span>
              )}
            </div>

            {/* Botones de acción 
            <div className="space-y-3">
              <button className="w-full bg-campomaq text-white py-3 px-6 rounded-lg hover:bg-campomaq/90 transition-colors font-medium">
                Agregar al Carrito
              </button>
              <button className="w-full border border-campomaq text-campomaq py-3 px-6 rounded-lg hover:bg-campomaq/10 transition-colors font-medium">
                Solicitar Cotización
              </button>
            </div>
          </div>
        </div>

        {/* Tabs de información 
        <div className="border-t border-gray-200">
          {/* Tab headers 
          <div className="flex overflow-x-auto border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-campomaq border-b-2 border-campomaq'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content 
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-campomaq"></div>
                <span className="ml-2 text-gray-600">Cargando detalles...</span>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>

      {/* Productos relacionados 
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div 
                key={relatedProduct.id} 
                className="cursor-pointer"
                onClick={() => onProductClick?.(relatedProduct.id)}
              >
                <CardProducto
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  originalPrice={relatedProduct.originalPrice}
                  image={relatedProduct.image}
                  category={relatedProduct.category}
                  brand={relatedProduct.brand}
                  brandLogo={relatedProduct.brandLogo}
                  isNew={relatedProduct.isNew}
                  isOnSale={relatedProduct.isOnSale}
                  discount={relatedProduct.discount}
                  description={relatedProduct.description}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; */}