'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { trackCategoryClick } from '@/lib/analytics'

const products = [
  { name: 'MOTOCULTORES', image: '/images/prod-home/MOTOCULTOR-TKC-450-1.png' },
  { name: 'BOMBAS DE FUMIGAR', image: '/images/prod-home/bomba-fumigacion.jpeg' },
  { name: 'MOTOAZADAS', image: '/images/prod-home/motoazada.jpg' },
  { name: 'DESBROZADORAS', image: '/images/prod-home/desbrozadora.jpg' },
  { name: 'MOTOSIERRAS', image: '/images/prod-home/motosierra.jpg' },
  { name: 'CORTACÉSPED', image: '/images/prod-home/cortacesped.jpeg' },
  { name: 'ACEITES', image: '/images/prod-home/husqvarna-Aceites.jpeg' },
  { name: 'SOPLADORAS', image: '/images/prod-home/sopladoras.webp' },
  { name: 'CUCHILLAS', image: '/images/prod-home/cuchillas-2.jpeg' },
  { name: 'MANGUERAS', image: '/images/prod-home/manguera.jpg' },
  { name: 'MINI TRACTOR', image: '/images/prod-home/mntrack.jpg' },
  { name: 'Y MUCHO MÁS', image: '/images/prod-home/otros.jpg' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
}

export default function Productos() {
  // Función para generar el link de búsqueda
  const getProductLink = (productName: string) => {
    if (productName === 'Y MUCHO MÁS') {
      // Para "Y MUCHO MÁS", solo ir a productos sin búsqueda
      return '/productos'
    }
    // Para otros productos, ir con búsqueda
    const searchQuery = encodeURIComponent(productName.toLowerCase())
    return `/productos?search=${searchQuery}`
  }

  // Handle category click with analytics tracking
  const handleCategoryClick = (productName: string) => {
    trackCategoryClick({
      category_name: productName,
      click_source: 'homepage',
      search_query: productName !== 'Y MUCHO MÁS' ? productName.toLowerCase() : undefined
    });
  }

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 relative bg-gray-900 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/bg/fondo.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold mb-12 text-center"
        >
          Nuestros Productos
        </motion.h2>

        {/* Flex adaptable y centrado */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="
            flex flex-wrap justify-center gap-4
          "
        >
          {products.map((product, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="
                group relative bg-white shadow-md overflow-hidden 
                transition-all duration-300 
                w-[45%] min-[515px]:w-[30%] md:w-[22%] lg:w-[18%]
              "
            >
              {/* Imagen */}
              <div className="relative w-full h-36 min-[515px]:h-40 md:h-44 lg:h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="
                    (max-width: 514px) 45vw, 
                    (max-width: 767px) 30vw, 
                    (max-width: 1023px) 22vw, 
                    18vw
                  "
                  className="object-cover"
                />

                {/* Overlay solo en desktop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="
                    hidden md:flex
                    absolute inset-0 
                    bg-black/50
                    flex-col items-center justify-center 
                    transition-opacity duration-300
                    text-center p-4
                  "
                >
                  <h3 className="text-sm font-bold text-white mb-2">{product.name}</h3>
                  <Link href={getProductLink(product.name)}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryClick(product.name)}
                      className="bg-black text-white px-3 py-1 text-sm font-semibold hover:bg-white hover:text-black cursor-pointer transition-colors rounded"
                    >
                      Ver más
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

              {/* Vista móvil */}
              <div className="flex md:hidden items-center justify-between p-2 bg-black border-t border-yellow-500 text-xs min-[515px]:text-sm">
                <span className="font-semibold text-white truncate">{product.name}</span>
                <Link href={getProductLink(product.name)}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCategoryClick(product.name)}
                    className="p-1 rounded-full bg-campomaq text-black hover:bg-black hover:text-campomaq hover:border-campomaq hover:border transition-colors cursor-pointer"
                  >
                    <Eye size={14} />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}