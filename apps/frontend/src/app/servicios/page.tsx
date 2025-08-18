'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Wrench, Truck, Headphones, Shield, Clock, Users, ChevronDown, ChevronUp, Check, Star} from 'lucide-react';
import { FaWhatsapp, FaYoutube} from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

const stats = [
  { number: "20+", label: "Años de Experiencia", icon: <Clock className="w-6 h-6" />, color: "from-blue-500 to-blue-600" },
  { number: "1000+", label: "Clientes Satisfechos", icon: <Users className="w-6 h-6" />, color: "from-green-500 to-green-600" },
  { number: '24/', label: "Soporte Técnico", icon: <Headphones className="w-6 h-6" />, color: "from-purple-500 to-purple-600" },
  { number: "100%", label: "Garantía", icon: <Shield className="w-6 h-6" />, color: "from-orange-500 to-orange-600" }
];

const services = [
  {
    icon: <Wrench className="w-10 h-10 text-black/60" />,
    title: "Servicio Técnico Especializado",
    description: "Contamos con técnicos certificados por las principales marcas para brindarte el mejor servicio post-venta y mantenimiento preventivo con tecnología de punta.",
    features: ["Diagnóstico especializado", "Reparación garantizada", "Mantenimiento preventivo", "Certificaciones oficiales"],
    videoId: "T2DXpm3xXCM",
    gradient: "from-blue-600 to-indigo-700",
    benefits: ["Reducción de tiempos de inactividad", "Mayor vida útil del equipo", "Costos operativos menores"]
  },
  {
    icon: <Truck className="w-10 h-10 text-gray-700" />,
    title: "Entrega y Logística",
    description: "Servicio de entrega a domicilio en todo el país con seguimiento en tiempo real, flota propia y garantía de entrega segura y puntual.",
    features: ["Entrega a domicilio", "Seguimiento en tiempo real", "Embalaje seguro", "Cobertura nacional"],
    videoId: "F4wYJjBu-7Y",
    gradient: "from-green-600 to-emerald-700",
    benefits: ["Entrega garantizada", "Seguimiento GPS", "Instalación incluida"]
  },
  {
    icon: <Headphones className="w-10 h-10 text-gray-700" />,
    title: "Asesoría Técnica",
    description: "Asesoramiento especializado personalizado para ayudarte a elegir la mejor maquinaria según tus necesidades específicas y presupuesto.",
    features: ["Asesoría personalizada", "Análisis de necesidades", "Comparativas técnicas", "Recomendaciones expertas"],
    videoId: "Bgg3ynClrsk",
    gradient: "from-purple-600 to-violet-700",
    benefits: ["Decisiones informadas", "Máximo ROI", "Soluciones a medida"]
  },
  {
    icon: <Shield className="w-10 h-10 text-gray-700" />,
    title: "Garantía Extendida",
    description: "Garantías extendidas en todos nuestros productos con cobertura completa, soporte técnico incluido y repuestos originales garantizados.",
    features: ["Garantía extendida", "Cobertura completa", "Soporte técnico", "Repuestos originales"],
    videoId: "Jm0WtfD5Gek",
    gradient: "from-orange-600 to-red-700",
    benefits: ["Tranquilidad total", "Protección de inversión", "Servicio premium"]
  },
  {
    icon: <Clock className="w-10 h-10 text-gray-700" />,
    title: "Servicio 24/7",
    description: "Atención al cliente disponible las 24 horas del día, 7 días a la semana para emergencias técnicas con respuesta inmediata garantizada.",
    features: ["Atención 24/7", "Emergencias técnicas", "Respuesta rápida", "Soporte continuo"],
    videoId: "n_D4gYO7f3I",
    gradient: "from-teal-600 to-cyan-700",
    benefits: ["Disponibilidad total", "Respuesta inmediata", "Soporte de emergencia"]
  },
  {
    icon: <Users className="w-10 h-10 text-gray-700" />,
    title: "Capacitación",
    description: "Programas de capacitación integral para el uso correcto, mantenimiento y optimización de la maquinaria agrícola con certificación oficial.",
    features: ["Capacitación técnica", "Manuales de uso", "Videos instructivos", "Sesiones prácticas"],
    videoId: "tpCoTL4mtO4",
    gradient: "from-pink-600 to-rose-700",
    benefits: ["Operación eficiente", "Seguridad laboral", "Certificación técnica"]
  }
];

const testimonials = [
  {
    name: "Juan Pérez",
    role: "Agricultor - Hacienda San José",
    content: "El servicio técnico es excepcional. Solucionaron mi problema en menos de 24 horas y el técnico era muy profesional. Mi producción no se detuvo gracias a su rapidez.",
    rating: 5,
    location: "Cayambe, Ecuador",
    avatar: "JP"
  },
  {
    name: "María Gómez",
    role: "Dueña de vivero - Jardines del Valle",
    content: "La asesoría que recibí fue fundamental para elegir la maquinaria adecuada. Me ahorraron mucho dinero al recomendarme exactamente lo que necesitaba.",
    rating: 5,
    location: "Quito, Ecuador",
    avatar: "MG"
  },
  {
    name: "Carlos Rodríguez",
    role: "Ingeniero Agrónomo - AgroTech Solutions",
    content: "Las capacitaciones son muy completas y los instructores tienen un gran conocimiento técnico. Recomiendo sus cursos a todos mis colegas del sector.",
    rating: 5,
    location: "Ibarra, Ecuador",
    avatar: "CR"
  },
  {
    name: "Ana Martínez",
    role: "Productora Orgánica - EcoFarms",
    content: "Su servicio de garantía extendida me ha dado mucha tranquilidad. Cuando tuve un problema, lo resolvieron sin costo adicional y muy rápido.",
    rating: 5,
    location: "Latacunga, Ecuador",
    avatar: "AM"
  }
];

const AnimatedCounter = ({ target, duration = 2 }: { target: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const numericTarget = parseInt(target.replace(/\D/g, ''));
      let startTime: number;
      
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOutCubic * numericTarget));
        
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      };
      
      requestAnimationFrame(animateCount);
    }
  }, [isInView, target, duration]);

  const formatCount = (num: number) => {
    if (target.includes('+')) return `${num}+`;
    if (target.includes('/')) return `${num}/7`;
    if (target.includes('%')) return `${num}%`;
    return num.toString();
  };

  return <span ref={ref}>{formatCount(count)}</span>;
};

export default function ServiciosPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  return (
    <main className="min-h-screen pt-20 overflow-hidden">
       {/* Hero Section with Advanced Animations */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: yBg }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-yellow-200" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Floating Elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-campomaq/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl"
            animate={{ 
              scale: [1.5, 1, 1.5],
              rotate: [360, 180, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
              <span className="block">NUESTROS</span>
              <span className="block bg-gradient-to-r from-campomaq via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                SERVICIOS
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 mb-10"
          >
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed">
              Soluciones integrales para el campo y jardinería con el respaldo de
              <br className="hidden md:block" />
              <span className="font-semibold text-campomaq"> más de 20 años de experiencia</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4"
          >
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Clean Black & Yellow */}
      <section className="py-16 bg-white border-y-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-black rounded-lg p-4 mb-3 inline-block group-hover:bg-gray-800 transition-colors">
                  <div className="text-campomaq">{stat.icon}</div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-black mb-1">
                  <AnimatedCounter target={stat.number} />
                </div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Clean and Professional */}
      <section id="servicios" className="py-20 bg-black">
        
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
           
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nuestros Servicios
            </h2>
            <div className="w-20 h-1 bg-campomaq mx-auto mb-4" />
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Soluciones profesionales para maximizar tu productividad
            </p>
          </motion.div>

          <div className="space-y-12">
            {services.map((service, index) => {
              const isExpanded = expanded === index;
              const reverse = index % 2 !== 0;
              
              return (
                
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col lg:flex-row ${reverse ? "lg:flex-row-reverse" : ""} gap-6`}
                >
                  
                  {/* Content Card */}
                  <div className="flex-1">
                    <div className="bg-white rounded-xl p-6 h-full flex flex-col border-2 border-gray-100 hover:border-campomaq/30 transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-campomaq rounded-lg flex items-center justify-center mr-4">
                            {service.icon}
                          </div>
                          <h3 className="text-xl font-bold text-black">{service.title}</h3>
                        </div>
                        
                        {/* Mobile expand button */}
                        <button
                          onClick={() => setExpanded(isExpanded ? null : index)}
                          className="lg:hidden w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Description - Always visible on desktop */}
                      <p className="text-gray-600 mb-4 hidden lg:block flex-grow">
                        {service.description}
                      </p>

                      {/* Mobile: Truncated description */}
                      <p className="text-gray-600 mb-4 lg:hidden">
                        {isExpanded ? service.description : `${service.description.slice(0, 80)}...`}
                      </p>

                      {/* Features - Desktop always visible, Mobile expandable */}
                      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block mb-6`}>
                        <ul className="space-y-2">
                          {service.features.map((feature, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-700">
                              <div className="w-4 h-4 bg-campomaq/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <Check className="w-3 h-3 text-black" />
                              </div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button - Desktop always visible, Mobile expandable */}
                      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block mt-auto`}>
                        <a
                          href="https://wa.me/593XXXXXXXXX"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-campomaq text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors w-full lg:w-auto justify-center lg:justify-start"
                        >
                          <FaWhatsapp className="w-4 h-4" />
                          Solicitar Servicio
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Video Player */}
                  <div className="flex-1">
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${service.videoId}?autoplay=1&mute=1&modestbranding=1&rel=0&loop=1&playlist=${service.videoId}&controls=1`}
                        title={`Video - ${service.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                      
                      {/* Video overlay with YouTube link */}
                      <div className="absolute top-4 right-4">
                        <a
                          href={`https://youtube.com/watch?v=${service.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-xs hover:bg-black/70 transition-colors flex items-center gap-2"
                        >
                          <FaYoutube className="w-3 h-3" />
                          YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced Design */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-campomaq/5 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              TESTIMONIOS
              <span className="block bg-gradient-to-r from-campomaq to-yellow-500 bg-clip-text text-transparent">
                REALES
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experiencias auténticas de agricultores y profesionales que confían en nuestros servicios
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-campomaq to-yellow-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 h-full">
                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-600 mb-6 italic leading-relaxed flex-grow">
                    &quot;{testimonial.content}&quot;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-campomaq to-yellow-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                      <p className="text-gray-500 text-xs mb-1">{testimonial.role}</p>
                      <p className="text-gray-400 text-xs">{testimonial.location}</p>
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