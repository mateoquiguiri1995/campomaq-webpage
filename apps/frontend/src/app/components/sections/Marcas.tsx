'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

type Brand = {
  name: string
  logo: string
  width?: number
  height?: number
}

const brands: Brand[] = [
  { name: 'Husqvarna', logo: '/images/brands/Husqvarna.jpg'},
  { name: 'Maruyama', logo: '/images/brands/Maruyama.png', width: 100 },
  { name: 'Subaru', logo: '/images/brands/subaru.jpeg' },
  { name: 'Kawasaki', logo: '/images/brands/kawasaki.png' },
  { name: 'Oleo-Mac', logo: '/images/brands/oleomac.jpg' },
  { name: 'Stihl', logo: '/images/brands/STIHL.jpg' },
  { name: 'Echo', logo: '/images/brands/echo.svg' },
  { name: 'Shindaiwa', logo: '/images/brands/Shindaiwa.png' }
]

const features = [
  {
    title: <>¿Por qué comprar en CAMPO MAQ?</>,
    content: "Más de 20 años de experiencia nos respaldan en la distribución de equipos de calidad para el campo y jardinería.",
    image: "/images/features/agricola.jpg"
  },
  {
    title: <>Soporte técnico especializado</>,
    content: "Contamos con técnicos certificados por las principales marcas para brindarte el mejor servicio post-venta.",
    image: "/images/features/soporte.jpg"
  }
]

export default function Marcas() {
  const router = useRouter()

  const handleBrandClick = (brandName: string) => {
    router.push(`/productos?search=${encodeURIComponent(brandName)}`)
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* 🔹 Título */}
        <motion.h2 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-black text-center text-2xl sm:text-3xl font-bold mb-6"
        >
          Distribuidores Certificados de:
        </motion.h2>

        {/* 🔹 Cinta transportadora */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden py-8"
        >
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((brand, index) => (
              <motion.div
                key={`${brand.name}-${index}`}
                whileHover={{ scale: 1.1, y: -5 }}
                className="mx-8 flex-shrink-0 cursor-pointer grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
                onClick={() => handleBrandClick(brand.name)}
              >
                <div
                  className="relative"
                  style={{
                    width: brand.width ? `${brand.width / 10}rem` : '7rem',
                    height: brand.height ? `${brand.height / 10}rem` : '4rem'
                  }}
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fade laterales */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
        </motion.div>

        {/* 🔹 Secciones */}
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="mb-16 md:mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={`space-y-6 ${
                index % 2 === 0 ? 'md:order-1 md:pr-8' : 'md:order-2 md:pl-8'
              }`}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-lg text-gray-600">{feature.content}</p>
            </motion.div>

            {/* Imagen */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className={`relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg ${
                index % 2 === 0 ? 'md:order-2' : 'md:order-1'
              }`}
            >
              <Image
                src={feature.image}
                alt={typeof feature.title === 'string' ? feature.title : ''}
                fill
                style={{ objectFit: 'cover' }}
                className="hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
