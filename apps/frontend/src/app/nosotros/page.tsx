'use client';

import { motion, useScroll, useTransform} from 'framer-motion';
import { Users, Target, Eye, Award, Tractor, Wrench, Globe, Leaf} from 'lucide-react';
import Image from 'next/image';

const team = [
  {
    name: "Manuel Quiguiri",
    position: "Director General",
    image: "/images/campomaq/user.webp",
    description: "Más de 25 años de experiencia en el sector agrícola",
    specialties: ["Liderazgo", "Estrategia", "Desarrollo de Negocio"]
  },
  {
    name: "Alexandra Quiguiri",
    position: "Gerente Comercial",
    image: "/images/campomaq/user.webp",
    description: "Especialista en relaciones comerciales y atención al cliente",
    specialties: ["Ventas", "Relaciones Públicas", "Servicio al Cliente"]
  },
  {
    name: "Mateo Quiguiri",
    position: "Jefe Tecnológico",
    image: "/images/campomaq/user.webp",
    description: "Técnico certificado con amplia experiencia en Tecnologías e Inventariado",
    specialties: ["Tecnología", "Inventarios", "Innovación"]
  }
];

const milestones = [
  { year: "2003", title: "Fundación", description: "Inicio de operaciones en Quito", icon: <Leaf className="w-6 h-6 text-black" /> },
  { year: "2008", title: "Expansión", description: "Traslado de Empresa a Cayambe", icon: <Globe className="w-6 h-6 text-black" /> },
  { year: "2013", title: "Certificaciones", description: "Obtuvimos certificaciones oficiales de las principales marcas", icon: <Award className="w-6 h-6 text-black" /> },
  { year: "2015", title: "Cobertura Nacional", description: "Llegamos a todo el país con maquinaria de calidad", icon: <Tractor className="w-6 h-6 text-black" /> },
  { year: "2023", title: "20 Años", description: "Celebramos 20 años de servicio al sector agrícola", icon: <Users className="w-6 h-6 text-black" /> }
];

const values = [
  { 
    icon: <Target className="w-10 h-10" />, 
    title: "Excelencia", 
    description: "Buscamos la excelencia en cada aspecto de nuestro servicio",
    color: "from-blue-500 to-purple-600"
  },
  { 
    icon: <Users className="w-10 h-10" />, 
    title: "Confianza", 
    description: "Construimos relaciones duraderas basadas en la confianza",
    color: "from-green-500 to-teal-600"
  },
  { 
    icon: <Award className="w-10 h-10" />, 
    title: "Calidad", 
    description: "Ofrecemos solo productos de la más alta calidad",
    color: "from-orange-500 to-red-600"
  },
  { 
    icon: <Eye className="w-10 h-10" />, 
    title: "Innovación", 
    description: "Siempre buscamos las mejores soluciones tecnológicas",
    color: "from-purple-500 to-pink-600"
  }
];

const services = [
  { icon: <Tractor className="w-8 h-8 text-gray-600" />, title: "Maquinaria Agrícola", description: "Comercialización de equipos de última generación" },
  { icon: <Wrench className="w-8 h-8 text-gray-600" />, title: "Servicio Técnico", description: "Soporte técnico especializado y mantenimiento" },
  { icon: <Target className="w-8 h-8 text-gray-600" />, title: "Partes y Accesorios", description: "Repuestos originales para todas las marcas" },
];


export default function NosotrosPage() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <main className="min-h-screen pt-20 overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: yBg }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-campomaq via-yellow-400/40 to-yellow-500/20" />
          <div className="absolute inset-0 bg-black/20" />
          
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              <span className="block">SOBRE</span>
              <span className="block bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                NOSOTROS
              </span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="backdrop-blur-md bg-black/20 rounded-3xl p-8 border border-white/20"
          >
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed">
              20 años siendo líderes en la distribución de 
              <br className="hidden md:block" />
              <span className="font-semibold"> maquinaria agrícola y de jardinería</span> en Ecuador
            </p>
          </motion.div>

        </div>
      </section>

      {/* Mission & Vision*/}
      <section className="py-32 px-6 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              NUESTRA ESENCIA
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-campomaq to-yellow-500 mx-auto" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-campomaq to-yellow-400 rounded-3xl blur-lg opacity-20" />
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-campomaq to-yellow-400 rounded-2xl flex items-center justify-center mr-4">
                    <Target className="w-8 h-8 text-white" />
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
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-lg opacity-20" />
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-black to-black/30 rounded-2xl flex items-center justify-center mr-4">
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

      {/* Timeline */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
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
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
              NUESTRA
              <span className="block bg-gradient-to-r from-campomaq to-yellow-400 bg-clip-text text-transparent">
                HISTORIA
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Dos décadas de crecimiento y compromiso con el sector agrícola
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

      {/* Values */}
      <section className="py-32 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-6">
              NUESTROS
              <span className="block bg-gradient-to-r from-campomaq to-yellow-500 bg-clip-text text-transparent">
                VALORES
              </span>
            </h2>
            <p className="text-xl text-gray-600">Los principios que guían nuestro trabajo diario</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -20, scale: 1.05 }}
                className="group relative"
              >
                <div className="absolute -inset-2 bg-gradient bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-lg"
                     style={{ background: `linear-gradient(45deg, ${value.color.split(' ')[1]}, ${value.color.split(' ')[3]})` }} />
                
                <div className="relative bg-gray-200 rounded-3xl p-8 shadow-lg border border-gray-100 h-full">
                  <div className={`w-20 h-20 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 mx-auto text-white shadow-xl`}>
                    {value.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
        
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
            <p className="text-xl text-gray-300">Profesionales comprometidos con tu éxito</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                  {/* Image container with overlay */}
                  <div className="relative h-90 overflow-hidden">
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating specialties */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 bg-campomaq/90 text-black text-xs rounded-full backdrop-blur-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-gray-500 font-semibold mb-4 text-lg">{member.position}</p>
                    <p className="text-gray-600 leading-relaxed">{member.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
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
              NUESTRA
              <span className="block bg-gradient-to-r from-campomaq to-yellow-500 bg-clip-text text-transparent">
                EMPRESA
              </span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >

             {/* Contenedor del video */}
              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative w-full max-w-3xl aspect-video shadow-lg rounded-lg overflow-hidden cursor-pointer"
                  onClick={() =>
                    window.open(`https://www.youtube.com/watch?v=2x8fautz2HA`, "_blank")
                  }
                >
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/2x8fautz2HA?autoplay=1&mute=1&loop=1&playlist=2x8fautz2HA&modestbranding=1&rel=0&showinfo=0"
                    title="Video de YouTube"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-bold text-black">CAMPOMAQ</span> nace con la finalidad de comercializar 
                  Maquinaria Agrícola, dar un Servicio Técnico y ofrecer Partes y Accesorios en todas las marcas, 
                  previamente seleccionadas bajo las premisas de <span className="font-semibold">calidad, productividad</span> y 
                  capacidad de satisfacer las necesidades del agricultor moderno.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Somos una empresa <span className="font-semibold text-black">dinámica</span>, habituada a cambiar 
                  constantemente nuestra gama de productos en función de los nuevos desarrollos tecnológicos y 
                  las cada vez más exigentes demandas de nuestros clientes.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Services Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-black/5 rounded-3xl p-8 shadow-lg border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-campomaq to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Final Statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-campomaq/20 to-yellow-300 rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-6 text-black">Nuestro Compromiso</h3>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto text-gray-600">
                Facilitar a nuestros clientes soluciones <span className="font-bold">viables económicamente</span>, 
                adaptadas a las distintas actualizaciones de maquinaria agrícola y un 
                <span className="font-bold"> soporte técnico calificado</span> durante toda la vida útil de nuestros productos.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}