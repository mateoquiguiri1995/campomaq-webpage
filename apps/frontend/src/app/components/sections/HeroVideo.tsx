'use client';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Download, Check } from 'lucide-react';

export default function HeroVideo() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDownloadCatalog = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      // 1. Mostrar efecto de descarga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 2. Crear descarga directa del archivo
      const response = await fetch('/catalogo.pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Crear enlace de descarga
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'catalogo.pdf';
      downloadLink.style.display = 'none';
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // 3. SOLO mostrar notificación, SIN abrir nueva pestaña automáticamente
      // El usuario puede abrir el PDF manualmente si lo desea
      
      // Limpiar la URL temporal
      window.URL.revokeObjectURL(url);
      
      setIsDownloading(false);
      setShowSuccess(true);
      
      // Ocultar mensaje de éxito después de 4 segundos para dar tiempo a ver
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
      
    } catch (error) {
      console.error('Error al procesar el catálogo:', error);
      setIsDownloading(false);
    }
  };

  return (
    <section className="relative w-full h-[100vh] md:h-screen overflow-hidden bg-black z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 object-cover w-full h-full z-[1]"
        poster="/images/campomaq/homepage-background.jpg"
      >
        <source src="/videos/videoCM.mp4" type="video/mp4" />
      </video>

      {/* Oscurecer video para mejor contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 pt-20 pl-8 pr-9 md:pl-40 md:pt-60 max-w-4xl">
        {/* h1 fluido */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="
            font-bold mb-6 leading-tight drop-shadow-xl text-white
            text-[clamp(3rem,9vw,5rem)] pl-[clamp(0.5rem,3vw,1rem)] pr-[clamp(0.5rem,3vw,1rem)] pt-[clamp(0.2rem,25vw,5rem)] 
          "
        >
          CAMPO MAQ
        </motion.h1>

        {/* párrafo fluido */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="
            mb-8 drop-shadow-md text-white
            text-[clamp(1rem,3vw,1.5rem)]
          "
        >
          Más de 20 años junto a florícolas y agricultores de Ecuador, brindando maquinaria y servicio técnico de la mejor calidad
        </motion.p>

        {/* Contenedor de botones mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="
            flex flex-col sm:flex-row gap-4 sm:gap-6
            items-stretch sm:items-center
            w-full sm:w-auto
          "
        >
          {/* Botón de descarga con contenedor relativo para el efecto */}
          <div className="relative">
            <motion.div
              whileHover={isDownloading ? {} : { scale: 1.05 }}
              whileTap={isDownloading ? {} : { scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={isDownloading ? undefined : handleDownloadCatalog}
                variant="primary"
                className={`
                  w-full sm:w-auto
                  text-[clamp(0.875rem,2.5vw,1.125rem)]
                  px-[clamp(1.25rem,3vw,2rem)]
                  py-[clamp(0.75rem,1.5vw,1rem)]
                  min-h-[44px] sm:min-h-[48px]
                  font-medium
                  transition-all duration-200
                  ${isDownloading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}
                `}
              >
                {isDownloading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Download size={18} />
                    </motion.div>
                    Descargando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Download size={18} />
                    Descargar Catálogo
                  </span>
                )}
              </Button>
            </motion.div>
            
            {/* Efecto de éxito flotante mejorado */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -10 }}
                  className="
                    absolute -top-14 left-1/2 transform -translate-x-1/2 
                    bg-green-500 text-white 
                    px-4 py-2 rounded-lg text-sm 
                    flex items-center gap-2 
                    whitespace-nowrap shadow-lg
                    z-50
                  "
                >
                  <Check size={16} />
                  ¡Catálogo descargado! Revisa tu carpeta de descargas
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Botón Ver Tienda */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              href='/productos'
              variant="outline"
              className="
                w-full sm:w-auto
                text-[clamp(0.875rem,2.5vw,1.125rem)]
                px-[clamp(1.25rem,3vw,2rem)]
                py-[clamp(0.75rem,1.5vw,1rem)]
                min-h-[44px] sm:min-h-[48px]
                font-medium
                transition-all duration-200
              "
            >
              Ver Tienda
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}