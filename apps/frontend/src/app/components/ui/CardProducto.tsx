"use client";

import { ShoppingCart, MessageCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand?: string;
  brandLogo?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  description?: string;
}

export default function CardProducto({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  brand,
  brandLogo,
  isNew = false,
  isOnSale = false,
  discount = 0,
  description,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    // Aquí se implementaría la lógica para agregar al carrito
    console.log(`Agregando ${name} al carrito`);
  };

  const handleQuote = () => {
    // Aquí se implementaría la lógica para cotizar por WhatsApp
    const message = `Hola, me interesa cotizar el producto: ${name}`;
    const whatsappUrl = `https://wa.me/593999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {isNew && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm animate-pulse">
            Nuevo
          </span>
        )}
        {isOnSale && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
            -{discount}%
          </span>
        )}
      </div>

      {/* Botón carrito */}
      <button
        onClick={handleAddToCart}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-campomaq shadow-md transition-all duration-200 hover:scale-110 cursor-pointer"
      >
        <ShoppingCart className="w-4 h-4 text-gray-600 hover:bg-campomaq" />
      </button>

      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay sutil en hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Información del producto */}
      <div className="p-4">
        {/* Marca (izquierda) y Categoría (derecha) */}
        <div className="flex items-center justify-between mb-3">
          {/* Marca - Izquierda */}
          <div className="flex items-center gap-2">
            {brandLogo && (
              <div className="w-6 h-6 rounded-full bg-white border border-gray-200 p-0.5 flex items-center justify-center">
                <img
                  src={brandLogo}
                  alt={brand}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {brand && (
              <span className="text-xs font-bold text-gray-700">{brand}</span>
            )}
          </div>
          
          {/* Categoría - Derecha */}
          <span className="text-xs text-black bg-gray-200 px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
        
        {/* Nombre del producto */}
        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 leading-tight">
          {name}
        </h3>

        {/* Descripción */}
        {description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Precios */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-2xl text-gray-900">
            ${price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Botón cotizar con WhatsApp */}
        <button
          onClick={handleQuote}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-0.5 cursor-pointer"
        >
          <svg 
            className="w-4 h-4" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          Cotizar
        </button>
      </div>
    </div>
  );
}
