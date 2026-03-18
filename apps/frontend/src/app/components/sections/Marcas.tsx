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
  { name: 'Husqvarna', logo: '/images/brands/husqvarna.png'},
  { name: 'Casamoto', logo: '/images/brands/casamoto.png'},
  { name: 'Mitubishi', logo: '/images/brands/mitsubishi-2.png'},
  { name: 'Annovi', logo: '/images/brands/annovi-reberberi.png'},
  { name: 'Ducati', logo: '/images/brands/ducati.png'},
  { name: 'Whalebest', logo: '/images/brands/whale-best.png', width: 100, height: 50 },
  { name: 'Maruyama', logo: '/images/brands/maruyama.png', width: 100 },
  { name: 'Oleo-Mac', logo: '/images/brands/oleo-mac.png' },
  { name: 'Stihl', logo: '/images/brands/stihl.png' },
  { name: 'Echo', logo: '/images/brands/echo.png' },
  { name: 'shindaiwa', logo: '/images/brands/shindaiwa.png' }
]

const features = [
  {
    title: <>Tu cultivo merece lo mejor y nosotros te lo damos</>,
    content: "Tu cultivo merece lo mejor, y en Campo Maq lo hacemos posible. Con más de 20 años de experiencia junto a florícolas y agricultores del país, somos tu aliado de confianza en maquinaria y equipos de alto rendimiento. Te acompañamos con asesoría técnica especializada y un servicio postventa que llega hasta tu campo, cuando y donde lo necesites.",
    youtubeId: "pkHpA-Nvb-U"
  },
  {
    title: <>Servicio Técnico Garantizado</>,
    content: "En Campo Maq no solo vendemos maquinaria, también la cuidamos. Contamos con un equipo técnico certificado que realiza reparaciones especializadas en todas las marcas y modelos. Disponemos de repuestos originales y ofrecemos servicio de mantenimiento y reparación en sitio, para que tu equipo nunca se detenga y tu trabajo en el campo siga siempre adelante",
    youtubeId: "j1wLY4I1QP8"
  }
]

export default function Marcas() {
  const router = useRouter()

  const handleBrandClick = (brandName: string) => {
    router.push(`/productos?brand=${encodeURIComponent(brandName)}`)
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
          Trabajamos con las mejores marcas
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
                    sizes="(max-width: 768px) 30vw, (max-width: 1200px) 15vw, 7rem"
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

        {/* 🔹 Secciones con alineación perfecta */}
        <div className="space-y-20 md:space-y-32 pt-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              {/* Contenedor de texto con altura fija para mantener proporción */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`flex flex-col justify-center h-full min-h-[240px] lg:min-h-[400px] ${
                  index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="space-y-4 lg:space-y-6">
                  <h3 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                    {feature.content}
                  </p>
                </div>
              </motion.div>

              {/* Video YouTube con proporción fija */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className={`${
                  index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                {/* Contenedor con aspect-ratio fijo para mantener proporción 16:9 */}
                <div 
                  className="relative w-full md:w-[60%] md:mx-auto lg:w-full lg:mx-0 aspect-video rounded-lg overflow-hidden shadow-xl cursor-pointer bg-gray-100"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${feature.youtubeId}`, "_blank")}
                >
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${feature.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${feature.youtubeId}&modestbranding=1&rel=0&showinfo=0`}
                    title={typeof feature.title === 'string' ? feature.title : "Video"}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    loading="lazy"
                  />
                  
                  {/* Overlay sutil para mejorar la interacción */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
