"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

/* ---------------------------------- Types --------------------------------- */
interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  brand?: string;
  brandLogo?: string;
  isNew?: boolean;
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

/* -------------------------- Utils ------------------------ */
const sanitizeHtml = (html?: string) => {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*("|\')\s*javascript:[^"']*\2/gi, ' $1="#"');
};

const useModalEffects = (isOpen: boolean, onClose: () => void) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 180);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  return { isClosing, handleClose, setIsClosing };
};

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const useMobileOverlay = (isMobile: boolean) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = () => {
    if (!isMobile || !scrollerRef.current || !heroRef.current) return;
    
    const scrollTop = scrollerRef.current.scrollTop;
    const heroHeight = heroRef.current.clientHeight || 1;
    const newProgress = Math.max(0, Math.min(1, scrollTop / (heroHeight * 0.9)));
    
    setProgress(newProgress);
    
    if (overlayRef.current) {
      overlayRef.current.style.setProperty("--overlay", String(newProgress));
    }
  };

  const resetScroll = useCallback(() => {
    setProgress(0);
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
  }, []);

  return { scrollerRef, heroRef, overlayRef, progress, onScroll, resetScroll };
};

/* -------------------------------- Components -------------------------------- */
const ImageNavigation = ({ 
  onPrev, 
  onNext, 
  currentIndex, 
  totalImages, 
  className = "" 
}: {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalImages: number;
  className?: string;
}) => (
  <>
    <button
      onClick={onPrev}
      className={`absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 lg:p-3 shadow hover:bg-white ${className}`}
    >
      <ChevronLeft className="size-5 lg:size-6 text-gray-700" />
    </button>
    <button
      onClick={onNext}
      className={`absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 lg:p-3 shadow hover:bg-white ${className}`}
    >
      <ChevronRight className="size-5 lg:size-6 text-gray-700" />
    </button>
    <span className="absolute bottom-2 lg:bottom-3 right-2 lg:right-4 rounded-full bg-black/75 text-white px-2 lg:px-3 py-0.5 lg:py-1 text-xs lg:text-sm">
      {currentIndex + 1}/{totalImages}
    </span>
  </>
);

const ProductBadges = ({ product, className = "" }: { product: Product; className?: string }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {product.isNew && (
      <span className="rounded-full bg-green-600 text-white px-3 py-1 text-xs font-semibold">
        Nuevo
      </span>
    )}
    {(product.discount ?? 0) > 0 && (
      <span className="rounded-full bg-red-600 text-white px-3 py-1 text-xs font-semibold">
        -{product.discount}% OFF
      </span>
    )}
  </div>
);
/*
const ProductRating = ({ size = "default" }: { size?: "default" | "small" }) => {
  const starSize = size === "small" ? "size-4" : "size-4";
  const textSize = size === "small" ? "text-xs" : "text-sm";
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${starSize} fill-yellow-400 text-yellow-400`} />
      ))}
      <span className={`ml-2 ${textSize} text-gray-600`}>
        4.8 ({size === "small" ? "128" : "128 reseñas"})
      </span>
    </div>
  );
}; */

const ProductFeatures = ({ size = "default" }: { size?: "default" | "small" }) => {
  const badgeSize = size === "small" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-sm";
  const iconSize = size === "small" ? "size-3.5" : "size-4";
  
  return (
    <div className="flex flex-wrap gap-2">
      <span className={`inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 ${badgeSize}`}>
        <Truck className={iconSize} />
        Envío a todo el país
      </span>
    </div>
  );
};

// Tipos de media
type MediaType = 'image' | 'video' | 'youtube' | 'unknown';

// Función mejorada para detectar tipo de media
const getMediaType = (url: string): MediaType => {
  if (!url) return 'unknown';
  
  const urlLower = url.toLowerCase();
  
  // Detectar YouTube URLs
  if (urlLower.includes('youtube.com/watch') || 
      urlLower.includes('youtu.be/') || 
      urlLower.includes('youtube.com/embed/')) {
    return 'youtube';
  }
  
  // Detectar videos directos
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.m4v'];
  if (videoExtensions.some(ext => urlLower.includes(ext))) {
    return 'video';
  }
  
  // Detectar imágenes
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  if (imageExtensions.some(ext => urlLower.includes(ext))) {
    return 'image';
  }
  
  // Si no tiene extensión pero no es YouTube, asumir que es imagen
  return 'image';
};

// Función para convertir URL de YouTube a embed
const getYouTubeEmbedUrl = (url: string): string => {
  try {
    let videoId = '';
    
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
      return url; // Ya es una URL de embed
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
    }
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
  }
  
  return url;
};

// Función utilitaria para detectar si una URL es un video
const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  const urlLower = url.toLowerCase();
  return videoExtensions.some(ext => urlLower.includes(ext));
};

// Componente mejorado para renderizar diferentes tipos de media
const MediaRenderer = ({ 
  src, 
  alt, 
  className = "",
  onLoad,
  onError,
  priority = false,
  autoplay = false,
  fill = true
}: {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  autoplay?: boolean;
  fill?: boolean;
}) => {
  const mediaType = getMediaType(src);

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    console.error(`Error loading media: ${src}`);
    onError?.();
  };

  switch (mediaType) {
    case 'youtube':
      const embedUrl = autoplay ? getYouTubeEmbedUrl(src) : src.replace('/watch?v=', '/embed/');
      return (
        <iframe
          src={embedUrl}
          title={alt}
          className={className}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={handleLoad}
          onError={handleError}
          style={fill ? { width: '100%', height: '100%' } : undefined}
        />
      );

    case 'video':
      return (
        <video
          src={src}
          className={className}
          autoPlay={autoplay}
          loop={autoplay}
          muted
          controls={!autoplay}
          playsInline
          onLoadedData={handleLoad}
          onError={handleError}
          preload={priority ? "auto" : "metadata"}
          style={fill ? { width: '100%', height: '100%', objectFit: 'contain' } : undefined}
        />
      );

    case 'image':
    default:
      return fill ? (
        <Image
          src={src}
          alt={alt}
          className={className}
          fill
          sizes="100vw"
          onLoadingComplete={handleLoad}
          onError={handleError}
          unoptimized
          style={{ objectFit: 'contain' }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          className={className}
          width={800}
          height={600}
          onLoadingComplete={handleLoad}
          onError={handleError}
          unoptimized
        />
      );
  }
};

/* Removed unused MediaThumbnail component to satisfy eslint: no-unused-vars */

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const isMobile = useResponsive();
  const { isClosing, handleClose, setIsClosing } = useModalEffects(isOpen, onClose);
  const { scrollerRef, heroRef, overlayRef, progress, onScroll, resetScroll } = useMobileOverlay(isMobile);

  // Reset closing state when modal opens with new product
  useEffect(() => {
    if (isOpen && product) {
      setIsClosing(false);
    }
  }, [isOpen, product, setIsClosing]);

  // Simple state management - no complex hooks
  const [imageIndex, setImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Get images array - prioritize additionalImages, fallback to main image
  const imageList = useMemo(() => {
    if (!product) return [];
    if (product.additionalImages && product.additionalImages.length > 0) {
      return product.additionalImages;
    }
    return product.image ? [product.image] : [];
  }, [product]);

  // Debug state changes
  useEffect(() => {
    console.log('imageIndex changed to:', imageIndex, 'currentImageSrc:', imageList[imageIndex]);
  }, [imageIndex, imageList]);

  // Reset when product changes
  useEffect(() => {
    if (product) {
      console.log('RESETTING imageIndex to 0 due to product change:', product.id);
      setImageIndex(0);
      setImageLoading(true);
      setImageError(false);
      resetScroll();
    }
  }, [product, resetScroll]);


  // Image handlers
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Navigation handlers
  const goToNext = () => {
    const nextIndex = (imageIndex + 1) % imageList.length;
    console.log('goToNext:', imageIndex, '->', nextIndex, 'imageList:', imageList);
    setImageIndex(nextIndex);
    setImageLoading(true);
    setImageError(false);
  };

  const goToPrev = () => {
    const prevIndex = (imageIndex - 1 + imageList.length) % imageList.length;
    console.log('goToPrev:', imageIndex, '->', prevIndex, 'imageList:', imageList);
    setImageIndex(prevIndex);
    setImageLoading(true);
    setImageError(false);
  };

  const goToIndex = (index: number) => {
    console.log('goToIndex called:', imageIndex, '->', index, 'imageList:', imageList);
    console.log('About to call setImageIndex with:', index);
    setImageIndex(index);
    setImageLoading(true);
    setImageError(false);
    console.log('setImageIndex called with:', index);
  };

  const htmlDesc = useMemo(() => 
    sanitizeHtml(
      product?.description || 
      `<p class="text-gray-500 italic">No hay descripción disponible para este producto.</p>`
    ), 
    [product?.description]
  );

  const handleWhatsApp = () => {
    if (!product) return;
    const message = `Hola, me interesa obtener más información sobre: ${product.name}`;
    const url = `https://wa.me/593980582555?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (!isOpen || !product) return null;

  const currentImageSrc = imageList[imageIndex] || "";

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-200 ${
            isClosing ? "opacity-0" : "opacity-60"
          }`}
          onClick={handleClose}
        />

        {/* Modal Container */}
        <div
          className={`relative mx-auto w-full max-w-full md:max-w-2xl lg:max-w-5xl h-[87vh] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ${
            isClosing ? "opacity-0 scale-[0.98] translate-y-2" : "opacity-100 scale-100"
          }`}
        >
          {/* Header */}
          <header className="flex items-center gap-3 border-b border-gray-100 px-4 sm:px-6 py-3 bg-white/90 backdrop-blur">
            {product.brandLogo && (
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white p-1">
                <Image
                  src={product.brandLogo}
                  alt={product.brand || "brand"}
                  className="h-full w-full object-contain"
                  width={44}
                  height={44}
                />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg sm:text-xl font-bold text-gray-900">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-gray-600 text-sm">{product.brand}</p>
              )}
            </div>
            <button
              onClick={handleClose}
              aria-label="Cerrar"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="size-5 text-gray-600" />
            </button>
          </header>

          {/* Body */}
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="relative h-[calc(86vh-64px)] overflow-y-auto scroll-smooth"
          >
            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-2 h-full">
              {/* Gallery */}
              <section className="relative bg-gray-50 flex flex-col h-full">
                <div className="relative flex items-center justify-center flex-1 min-h-[420px] lg:h-[520px]">
                  {imageLoading && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
                    </div>
                  )}
                  
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="text-center text-gray-500">
                        <div className="text-2xl mb-2">📷</div>
                        <p className="text-sm">Error al cargar el contenido</p>
                      </div>
                    </div>
                  )}
                  
                  {currentImageSrc && (
                    <div className="relative h-full w-full">
                      <MediaRenderer
                        key={`desktop-${imageIndex}-${currentImageSrc}`}
                        src={currentImageSrc}
                        alt={`${product.name} - ${imageIndex + 1}`}
                        className={`object-contain p-4 transition-all duration-300 ${
                          imageLoading || imageError ? "opacity-0 scale-95" : "opacity-100 scale-100"
                        }`}
                        priority={imageIndex === 0}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        autoplay={true} // Videos tendrán autoplay
                      />
                    </div>
                  )}
                  
                  <ProductBadges product={product} className="absolute left-4 top-4 z-20" />
                  
                  {imageList.length > 1 && (
                    <ImageNavigation
                      onPrev={goToPrev}
                      onNext={goToNext}
                      currentIndex={imageIndex}
                      totalImages={imageList.length}
                      className="z-20"
                    />
                  )}
                </div>

                {/* Thumbnails con indicador de video */}
                {imageList.length > 1 && (
                  <div className="h-28 bg-white/60 backdrop-blur px-4">
                    <div className="flex gap-3 py-3 overflow-x-auto">
                      {imageList.map((media, i) => {
                        const isVideo = isVideoUrl(media);
                        return (
                          <button
                            key={`thumb-${i}`}
                            onClick={() => goToIndex(i)}
                            className={`size-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all relative ${
                              i === imageIndex
                                ? "border-campomaq ring-2 ring-campomaq/30"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            {isVideo ? (
                              <>
                                <video
                                  src={media}
                                  className="h-full w-full object-cover"
                                  muted
                                  preload="metadata"
                                />
                                {/* Indicador de video */}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <Image
                                src={media}
                                alt={`thumbnail ${i + 1}`}
                                className="h-full w-full object-cover"
                                width={80}
                                height={80}
                                loading="lazy"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* Details */}
              <section className="relative flex flex-col min-h-0">
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                   {/** <ProductRating />*/} 
                    <ProductFeatures />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6">
                  <article
                    className="product-description text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: htmlDesc }}
                  />
                </div>

                {/* CTA */}
                <div className="sticky bottom-0 bg-white/95 backdrop-blur px-6 py-4">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow hover:bg-green-700 transition-colors"
                  >
                    Cotizar por WhatsApp
                  </button>
                </div>
              </section>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
              {/* Hero Image */}
              <section
                ref={heroRef}
                className="sticky top-0 z-0 h-[54vh] bg-gray-50 border-b"
              >
                <div className="relative flex h-full items-center justify-center">
                  {imageLoading && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
                    </div>
                  )}
                  
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="text-center text-gray-500">
                        <div className="text-2xl mb-2">📷</div>
                        <p className="text-sm">Error al cargar el contenido</p>
                      </div>
                    </div>
                  )}
                  
                  {currentImageSrc && (
                    <div className="relative h-full w-full">
                      <MediaRenderer
                        key={`mobile-${imageIndex}-${currentImageSrc}`}
                        src={currentImageSrc}
                        alt={`${product.name} - ${imageIndex + 1}`}
                        className={`object-contain p-3 transition-all duration-300 ${
                          imageLoading || imageError ? "opacity-0 scale-95" : "opacity-100 scale-100"
                        }`}
                        priority={imageIndex === 0}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        autoplay={true} // Videos tendrán autoplay
                      />
                    </div>
                  )}

                  {imageList.length > 1 && (
                    <ImageNavigation
                      onPrev={goToPrev}
                      onNext={goToNext}
                      currentIndex={imageIndex}
                      totalImages={imageList.length}
                      className="z-20"
                    />
                  )}

                  {/* WhatsApp Button */}
                  <button
                    onClick={handleWhatsApp}
                    className="absolute right-3 top-3 rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-green-700 transition-colors z-20"
                  >
                    Cotizar
                    <FaWhatsapp className="inline-block size-4 ml-1" />
                  </button>
                </div>
              </section>

              {/* Overlay Content */}
              <section
                ref={overlayRef}
                className="relative -mt-6 rounded-t-2xl bg-white px-4 py-5 shadow-[0_-8px_24px_rgba(0,0,0,0.12)]"
                style={{
                  transform: `translateY(${Math.max(0, 16 - progress * 16)}px)`,
                  boxShadow: `0 -12px ${8 + progress * 16}px rgba(0,0,0,${0.1 + progress * 0.1})`,
                  backdropFilter: `saturate(${1 + progress * 0.4})`,
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  {/** <ProductRating size="small" />*/} 
                  <ProductFeatures size="small" />
                </div>

                <article
                  className="product-description text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: htmlDesc }}
                />

                <div className="h-8" />
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        /* Product Description Styles */
        :global(.product-description h2) {
          font-size: 1.25rem;
          font-weight: 800;
          color: #111827;
          margin: 1.25rem 0 0.75rem;
          padding-bottom: 0.4rem;
          border-bottom: 3px solid #e5e7eb;
          position: relative;
        }
        :global(.product-description h2:after) {
          content: "";
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 64px;
          height: 3px;
          background: linear-gradient(90deg, #e1f814fb, #e9f72eff);
          border-radius: 3px;
        }
        :global(.product-description h3) {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin: 1rem 0 0.5rem;
          position: relative;
          padding-left: 0.75rem;
        }
        :global(.product-description h3:before) {
          content: "";
          position: absolute;
          left: 0;
          top: 0.2rem;
          width: 4px;
          height: 1.1rem;
          background: linear-gradient(#3b82f6, #e9ec11ff);
          border-radius: 2px;
        }
        :global(.product-description p) {
          margin-bottom: 0.9rem;
          line-height: 1.7;
          color: #374151;
          text-align: justify;
        }
        :global(.product-description ul) {
          list-style: none;
          margin: 0 0 1rem 0;
          padding: 0.75rem;
          border-left: 4px solid #fde619ff;
          border-radius: 0.75rem;
          background: #f8fafc;
        }
        :global(.product-description li) {
          margin: 0 0 0.55rem 0;
          padding-left: 1.7rem;
          color: #374151;
          position: relative;
        }
        :global(.product-description li:before) {
          content: "✓";
          position: absolute;
          left: 0;
          top: 0.05rem;
          width: 1.25rem;
          height: 1.25rem;
          display: grid;
          place-items: center;
          border-radius: 50%;
          font-size: 0.7rem;
          color: #000302ff;
          background: #fde619ff;
          border: 2px solid #000302ff;
        }
        :global(.product-description strong) {
          font-weight: 700;
          color: #111827;
          background: linear-gradient(135deg, #070707ff, #080800ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        :global(.product-description em) {
          font-style: italic;
          color: #6b7280;
          background: #f1f5f9;
          padding: 0.05rem 0.25rem;
          border-radius: 0.25rem;
        }
        :global(.product-description table) {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0 1.4rem;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
        }
        :global(.product-description tr) {
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.2s ease;
        }
        :global(.product-description tr:hover) {
          background: #f9fafb;
        }
        :global(.product-description tr:last-child) {
          border-bottom: 0;
        }
        :global(.product-description td) {
          padding: 0.85rem;
          color: #374151;
          vertical-align: top;
        }
        :global(.product-description td:first-child) {
          width: 40%;
          font-weight: 700;
          color: #1f2937;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.06), rgba(29, 78, 216, 0.06));
          border-right: 1px solid #e5e7eb;
        }

        @media (max-width: 1023px) {
          :global(.product-description table) {
            font-size: 0.9rem;
          }
          :global(.product-description h2) {
            font-size: 1.1rem;
          }
          :global(.product-description h3) {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default ProductModal;