'use client'
import Image from 'next/image'
import { Eye } from 'lucide-react'
import { motion } from 'framer-motion'

const products = [
  { name: 'MOTOCULTORES', description: 'maquinas increibles adaptables al terreno', image: '/images/prod-home/motocultor.jpg' },
  { name: 'BOMBAS DE FUMIGAR', description: 'Ideales para evitar plagas', image: '/images/prod-home/bombas fumigar.jpg' },
  { name: 'MOTOAZADAS', description: 'maquinas de diferentes marcas', image: '/images/prod-home/motoazada.jpg' },
  { name: 'DESBROZADORAS', description: 'Perfectas para la epoca de lluvias', image: '/images/prod-home/desbrozadora.jpg' },
  { name: 'MOTOSIERRAS', description: 'Diferentes marcas que garantizan un corte suave y limpio', image: '/images/prod-home/motosierra.jpg' },
  { name: 'CORTACÉSPED', description: 'excelentes para arbustos bajos y altos', image: '/images/prod-home/cortacesped.jpeg' },
  { name: 'ACEITES', description: 'Disponibles para cualquier maquinaria', image: '/images/prod-home/husqvarna-Aceites.jpeg' },
  { name: 'SOPLADORAS', description: 'Ideales para la limpieza de hojas y basura', image: '/images/prod-home/sopladoras.webp' },
  { name: 'CUCHILLAS', description: 'Disponibles para cualquier maquina o herramienta', image: '/images/prod-home/cuchillas-2.jpeg' },
  { name: 'MANGUERAS', description: 'Solidos y perfectos para la seguridad', image: '/images/prod-home/manguera.jpg' },
  { name: 'MINI TRACTOR', description: 'Vehiculo adaptable a cualquier terreno', image: '/images/prod-home/mntrack.jpg' },
  { name: 'Y m', description: 'Tijeras, Machetes, Azadones, etc', image: '/images/prod-home/otros.jpg' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
};

export default function Productos() {
  return (
    <section 
      className="py-16 px-4 sm:px-6 lg:px-8 relative bg-gray-900 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/bg/bg-home-prod.jpg')`,
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

        {/* Grid adaptable */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="
            grid 
            gap-8 
            justify-center
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-5
          "
        >
          {products.map((product, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white shadow-md overflow-hidden transition-all duration-300 rounded-lg"
            >
              {/* Imagen */}
              <div className="relative w-full h-56 md:h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="
                    (max-width: 640px) 100vw, 
                    (max-width: 1024px) 50vw, 
                    (max-width: 1280px) 33vw, 
                    20vw
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
                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white px-4 py-2 font-semibold hover:bg-white hover:text-black cursor-pointer transition-colors rounded"
                  >
                    Ver más
                  </motion.button>
                </motion.div>
              </div>

              {/* Vista móvil */}
              <div className="flex md:hidden items-center justify-between p-3 bg-black border-t border-yellow-500">
                <span className="font-semibold text-white">{product.name}</span>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-campomaq text-black hover:bg-black hover:text-campomaq hover:border-campomaq hover:border-2 transition-colors cursor-pointer"
                >
                  <Eye size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
