'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Image {
  src: string
  alt: string
}

const images: Image[] = [
  { src: '/images/campomaq/cmaq1.jpeg', alt: 'Campo Maq 1' },
  { src: '/images/campomaq/cmaq2.jpeg', alt: 'Campo Maq 2' },
  { src: '/images/campomaq/cmaq3.jpeg', alt: 'Campo Maq 3' },
  { src: '/images/campomaq/cmaq4.jpeg', alt: 'Campo Maq 4' },
  { src: '/images/campomaq/cmaq5.jpeg', alt: 'Campo Maq 5' },
]

const imagePairs: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [1, 3],
  [2, 0],
  [3, 1],
  [4, 2],
  [0, 3],
]

export default function Ubicacion() {
  const [pairIndex, setPairIndex] = useState(0)
  const [topImageIndex, bottomImageIndex] = imagePairs[pairIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setPairIndex((prev) => (prev + 1) % imagePairs.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 relative z-10">
        {/* Contenedor de imágenes */}
        <div className="relative h-[500px] w-full rounded-xl shadow-lg bg-gray-100 overflow-hidden p-2">
          <AnimatePresence initial={false}>
            {/* Imagen superior */}
            <motion.div
              key={`top-${topImageIndex}`}
              layoutId={`top-${topImageIndex}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute top-2 left-2 right-2 h-[calc(50%-1rem)]"
            >
              <img
                src={images[topImageIndex].src}
                alt={images[topImageIndex].alt}
                className="w-full h-full rounded-xl object-contain"
              />
            </motion.div>

            {/* Imagen inferior */}
            <motion.div
              key={`bottom-${bottomImageIndex}`}
              layoutId={`bottom-${bottomImageIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute bottom-2 left-2 right-2 h-[calc(50%-1rem)]"
            >
              <img
                src={images[bottomImageIndex].src}
                alt={images[bottomImageIndex].alt}
                className="w-full h-full rounded-xl object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mapa */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative rounded-xl overflow-hidden shadow-xl border border-gray-200 h-[500px]"
        >
          
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6836.718431266332!2d-78.147646!3d0.037993!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2a08f8f22e24a5%3A0xd6b23f6070e0cef6!2sCampo%20Maq!5e1!3m2!1ses-419!2sar!4v1754957490265!5m2!1ses-419!2sar"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  )
}