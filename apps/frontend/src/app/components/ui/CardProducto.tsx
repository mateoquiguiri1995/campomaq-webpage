"use client";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  category: string;
  brand?: string;
  brandLogo?: string;
  isNew?: boolean;
  discount?: number;
  description?: string;
  priority?: boolean;
}

export default function CardProducto({
  name,
  image,
  category,
  brand,
  brandLogo,
  isNew = false,
  discount = 0,
  description,
  priority = false,
}: ProductCardProps) {
  const isBlobStorageImage = image.startsWith("https://campomaq.blob.core.windows.net/");

  const handleQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hola, me interesa cotizar el producto: ${name}`;
    const whatsappUrl = `https://wa.me/593980582555?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // Función para extraer solo el primer párrafo descriptivo
  const getDescriptionPreview = (htmlDescription: string | undefined): string => {
    if (!htmlDescription) return '';
    
    // Buscar el primer párrafo <p> que no esté vacío
    const pRegex = /<p[^>]*>(.*?)<\/p>/i;
    const match = htmlDescription.match(pRegex);
    
    if (match && match[1]) {
      // Limpiar el HTML del párrafo para mostrar solo texto plano en la tarjeta
      return match[1]
        .replace(/<[^>]*>/g, '') // Remover todas las etiquetas HTML
        .replace(/&nbsp;/g, ' ') // Reemplazar espacios no separables
        .replace(/&amp;/g, '&')  // Reemplazar &amp; con &
        .replace(/&lt;/g, '<')   // Reemplazar &lt; con <
        .replace(/&gt;/g, '>')   // Reemplazar &gt; con >
        .trim();
    }
    
    return '';
  };

  const descriptionPreview = getDescriptionPreview(description);

  return (
    <div
      className="
        group relative bg-white rounded-2xl shadow-sm 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
        overflow-hidden cursor-pointer border border-gray-100 
        hover:border-gray-200 flex flex-col h-full
      "
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {isNew && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm animate-pulse">
            Nuevo
          </span>
        )}
        {(discount ?? 0) > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
            -{discount}%
          </span>
        )}
      </div>

      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          unoptimized={isBlobStorageImage}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4 justify-between">
        <div>
          {/* Marca y Categoría */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              {brandLogo && (
                <div className="w-6 h-6 rounded-full bg-white border border-gray-200 p-0.5 flex items-center justify-center shrink-0 relative">
                  <Image
                    src={brandLogo}
                    alt={brand ?? "brand"}
                    fill
                    sizes="24px"
                    className="object-contain"
                  />
                </div>
              )}
              {brand && (
                <span className="text-xs font-bold text-gray-700 truncate max-w-[80px] sm:max-w-[100px]">
                  {brand}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs text-black bg-gray-200 px-2 py-0.5 rounded-full truncate max-w-[80px] sm:max-w-[100px] text-center">
              {category}
            </span>
          </div>

          {/* Nombre */}
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
            {name}
          </h3>

          {/* Descripción resumida */}
          {descriptionPreview && (
            <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">
              {descriptionPreview}
            </p>
          )}
        </div>

        {/* Botón cotizar */}
        <button
          onClick={handleQuote}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xs sm:text-sm py-2 sm:py-3 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg transform hover:scale-[1.02] mt-auto"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
          Cotizar
        </button>
      </div>
    </div>
  );
}
