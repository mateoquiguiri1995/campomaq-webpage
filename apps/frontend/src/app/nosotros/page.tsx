'use client';

import { motion } from 'framer-motion';
import { Users, Target, Eye, Award, Tractor, Globe, Leaf, Star, Quote } from 'lucide-react';
import Image from 'next/image';

// Imágenes del equipo corporativo (reemplaza con tus imágenes reales)
const teamGallery = [
  {
    id: 1,
    image: "/images/campomaq/cmaq1.jpeg",
    category: "Dirección",
    aspect: "vertical"
  },
  {
    id: 2,
    image: "/images/campomaq/cmaq2.jpeg",
    category: "Equipo Técnico",
    aspect: "horizontal"
  },
  {
    id: 3,
    image: "/images/campomaq/cmaq3.jpeg",
    category: "Reunión Ejecutiva",
    aspect: "vertical"
  },
  {
    id: 4,
    image: "/images/campomaq/cmaq4.jpeg",
    category: "Trabajo en Campo",
    aspect: "horizontal"
  },
  {
    id: 5,
    image: "/images/campomaq/cmaq5.jpeg",
    category: "Capacitación",
    aspect: "vertical"
  },
  {
    id: 6,
    image: "/images/campomaq/cmaq6.jpg",
    category: "Innovación",
    aspect: "horizontal"
  },
  {
    id: 7,
    image: "/images/campomaq/cmaq7.jpg",
    category: "Calidad",
    aspect: "vertical"
  },
  {
    id: 8,
    image: "/images/campomaq/cmaq1.jpeg",
    category: "Tecnología",
    aspect: "horizontal"
  }
];

const milestones = [
  { year: "2003", title: "Fundación", description: "Inicio de operaciones en Cayambe", icon: <Leaf className="w-6 h-6 text-black" /> },
  { year: "2008", title: "Certificación de Distribución", description: "Obtuvimos certificaciones oficiales de Husqvarna, Maruyama y Briggs Stratton", icon: <Award className="w-6 h-6 text-black" /> },
  { year: "2012", title: "Representación regional exclusiva", description: "Obtuvimos la representación exclusiva de las principales marcas del país", icon: <Globe className="w-6 h-6 text-black" /> },
  { year: "2021", title: "Primera Importación", description: "Llegamos a todo el sector florícola con maquinaria importada de calidad mundial", icon: <Tractor className="w-6 h-6 text-black" /> },
  { year: "2025", title: "23 Años", description: "Celebramos 23 años de acompañar al sector florícola y agrícola, motivandonos siempre a mejorar", icon: <Users className="w-6 h-6 text-black" /> }
];

const values = [
  { 
    icon: <Target className="w-10 h-10" />, 
    title: "Excelencia", 
    description: "Buscamos la excelencia en cada aspecto de nuestro servicio",
    color: "from-campomaq to-campomaq/80"
  },
  { 
    icon: <Users className="w-10 h-10" />, 
    title: "Confianza", 
    description: "Construimos relaciones duraderas basadas en la confianza",
    color: "from-campomaq to-campomaq/80"
  },
  { 
    icon: <Award className="w-10 h-10" />, 
    title: "Calidad", 
    description: "Ofrecemos solo productos de la más alta calidad",
    color: "from-campomaq to-campomaq/80"
  },
  { 
    icon: <Eye className="w-10 h-10" />, 
    title: "Innovación", 
    description: "Siempre buscamos las mejores soluciones tecnológicas",
    color: "from-campomaq to-campomaq/80"
  }
];

const testimonials = [
  {
    name: "José Vicente Panoluisa Proaño",
    profession: "Agricultor",
    city: "Cayambe, Ecuador",
    rating: 5,
    comment: "El servicio es excelente la atención están pendiente sobre los productos que distribuyen.",
    image: "/images/testimonials/user1.jpg"
  },
  {
    name: "Jhonny David Aguilar Tabango",
    profession: "Agricultor",
    city: "Cayambe, Ecuador",
    rating: 5,
    comment: "Buena Atención",
    image: "/images/testimonials/user2.jpg"
  }
];

export default function NosotrosPage() {
  // Removed unused scroll animation variables

  return (
    <main className="min-h-screen pt-5 overflow-hidden">

      {/* Timeline - Mejorado con más espacio superior */}
      <section className="py-40 bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
              NUESTRA
              <span className="block bg-gradient-to-r from-campomaq to-yellow-400 bg-clip-text text-transparent">
                HISTORIA
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Más de 20 años de experiencia apoyando a florícolas y agricultores en Ecuador
            </p>
          </motion.div>

          <div className="relative">
            {/* Curved timeline line */}
            <svg className="absolute inset-0 w-full h-full hidden lg:block" style={{ zIndex: 1 }}>
              <motion.path
                d="M 100 100 Q 400 200 700 100 T 1300 200"
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FCD34D" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>

            <div className="grid lg:grid-cols-5 gap-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative z-10"
                >
                  <div className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-20 h-20 bg-gradient-to-r from-campomaq to-yellow-400 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl"
                    >
                      {milestone.icon}
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                    >
                      <div className="text-4xl font-black text-campomaq mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{milestone.description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valores Combinados con Video */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-campomaq/5 to-yellow-50" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-6">
              NUESTROS
              <span className="block bg-campomaq  bg-clip-text text-transparent">
                VALORES
              </span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative w-full aspect-video shadow-2xl rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => window.open(`https://www.youtube.com/watch?v=2x8fautz2HA`, "_blank")}
              >
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/2x8fautz2HA?autoplay=1&mute=1&loop=1&playlist=2x8fautz2HA&modestbranding=1&rel=0&showinfo=0"
                  title="Video de YouTube"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>

            {/* Values Cards - Alineadas con el video */}
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-campomaq opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm" />
                  
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full group-hover:shadow-xl transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-4 text-black shadow-md`}>
                      {value.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision*/}
      <section className="py-32 px-6 bg-white relative pt-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-black mb-6">
              NUESTRA
              <span className="block bg-campomaq bg-clip-text text-transparent">
                ESCENCIA
              </span>
            </h2>
            <p className="text-xl text-gray-600">Profesionales comprometidos con tu éxito</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-campomaq rounded-3xl blur-lg opacity-20" />
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-campomaq rounded-2xl flex items-center justify-center mr-4">
                    <Target className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">Misión</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Empresa comercial y de servicio dedicada a proveer equipos de calidad a los sectores 
                  agrícola y forestal a nivel nacional, brindando soluciones efectivas a las necesidades 
                  de nuestros clientes.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-black rounded-3xl blur-lg opacity-20" />
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mr-4">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">Visión</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Consolidarnos como empresa líder en la comercialización de nuestros productos y 
                  servicio especializado con personal técnico competente que propone y ejecuta políticas 
                  de estandarización de procesos para la entrega de un servicio de calidad.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Galería Corporativa del Equipo */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        
        {/* Efecto de partículas sutiles */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
              NUESTRO
              <span className="block bg-gradient-to-r from-campomaq to-yellow-400 bg-clip-text text-transparent">
                EQUIPO
              </span>
            </h2>
            <p className="text-xl text-gray-300">Excelencia corporativa en cada acción</p>
          </motion.div>

          {/* Galería Masonry con efectos profesionales */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {teamGallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="break-inside-avoid relative group cursor-pointer"
              >
                {/* Overlay de gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 rounded-2xl" />
                
                {/* Etiqueta de categoría */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <span className="bg-gradient-to-r from-campomaq to-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {item.category}
                  </span>
                </motion.div>

                {/* Efecto de borde luminoso */}
                <div className="absolute -inset-1 bg-gradient-to-r from-campomaq to-yellow-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                
                {/* Contenedor de imagen */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={item.image}
                    alt={`Equipo corporativo - ${item.category}`}
                    width={600}
                    height={item.aspect === "vertical" ? 800 : 400}
                    className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                      item.aspect === "vertical" ? "aspect-[3/4]" : "aspect-[4/3]"
                    }`}
                  />
                  
                  {/* Efecto de brillo al hover */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Texto descriptivo debajo de la galería */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Un equipo comprometido con la excelencia, innovación y calidad en cada proyecto. 
              Profesionales altamente capacitados trabajando en conjunto para superar las expectativas 
              de nuestros clientes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-6">
              NUESTROS
              <span className="block bg-gradient-to-r from-campomaq to-yellow-500 bg-clip-text text-transparent">
                CLIENTES
              </span>
            </h2>
            <p className="text-xl text-gray-600">Clientes que confían en nosotros</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-campomaq to-yellow-400 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-campomaq to-yellow-400 rounded-full flex items-center justify-center mr-4">
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <h5 className="text-gray-900">{testimonial.profession}</h5>
                      <p className="text-sm text-gray-600">{testimonial.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    &ldquo;{testimonial.comment}&rdquo;
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <span>Google Reviews</span>
                      <div className="ml-2 flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-semibold">5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}