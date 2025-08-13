'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Truck, Headphones, Shield, Clock, Users, ChevronDown, ChevronUp, Check, ArrowRight } from 'lucide-react';
import { FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { useState } from 'react';

const stats = [
  { number: "20+", label: "Años de Experiencia" },
  { number: "50K+", label: "Clientes Satisfechos" },
  { number: "24/7", label: "Soporte Técnico" },
  { number: "100%", label: "Garantía" }
];

const services = [
  {
    icon: <Wrench className="w-8 h-8" />,
    title: "Servicio Técnico Especializado",
    description: "Contamos con técnicos certificados por las principales marcas para brindarte el mejor servicio post-venta y mantenimiento preventivo.",
    features: ["Diagnóstico especializado", "Reparación garantizada", "Mantenimiento preventivo", "Certificaciones oficiales"],
    videoId: "T2DXpm3xXCM"
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Entrega y Logística",
    description: "Servicio de entrega a domicilio en todo el país con seguimiento en tiempo real y garantía de entrega segura.",
    features: ["Entrega a domicilio", "Seguimiento en tiempo real", "Embalaje seguro", "Cobertura nacional"],
    videoId: "F4wYJjBu-7Y"
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: "Asesoría Técnica",
    description: "Asesoramiento especializado para ayudarte a elegir la mejor maquinaria según tus necesidades específicas.",
    features: ["Asesoría personalizada", "Análisis de necesidades", "Comparativas técnicas", "Recomendaciones expertas"],
    videoId: "Bgg3ynClrsk"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Garantía Extendida",
    description: "Garantías extendidas en todos nuestros productos con cobertura completa y soporte técnico incluido.",
    features: ["Garantía extendida", "Cobertura completa", "Soporte técnico", "Repuestos originales"],
    videoId: "Jm0WtfD5Gek"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Servicio 24/7",
    description: "Atención al cliente disponible las 24 horas del día, 7 días a la semana para emergencias técnicas.",
    features: ["Atención 24/7", "Emergencias técnicas", "Respuesta rápida", "Soporte continuo"],
    videoId: "n_D4gYO7f3I"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Capacitación",
    description: "Programas de capacitación para el uso correcto y mantenimiento de la maquinaria agrícola.",
    features: ["Capacitación técnica", "Manuales de uso", "Videos instructivos", "Sesiones prácticas"],
    videoId: "tpCoTL4mtO4"
  }
];

const testimonials = [
  {
    name: "Juan Pérez",
    role: "Agricultor",
    content: "El servicio técnico es excelente, solucionaron mi problema en menos de 24 horas. ¡Altamente recomendados!",
    rating: 5
  },
  {
    name: "María Gómez",
    role: "Dueña de vivero",
    content: "La asesoría que recibí fue fundamental para elegir la maquinaria adecuada para mi negocio.",
    rating: 5
  },
  {
    name: "Carlos Rodríguez",
    role: "Ingeniero Agrónomo",
    content: "Las capacitaciones son muy completas y los instructores tienen un gran conocimiento técnico.",
    rating: 4
  }
];

export default function ServiciosPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);

  return (
    <main className="min-h-screen pt-25 bg-gradient-to-b from-yellow-50 to-white">
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white to-campomaq" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="text-5xl md:text-7xl font-bold text-black mb-6"
          >
            Nuestros Servicios
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} 
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto"
          >
            Soluciones integrales para el campo y jardinería con el respaldo de más de 20 años de experiencia
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
          </motion.div>
        </div>
      </section>

       {/* Stats */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-campomaq mb-2">{stat.number}</div>
                <div className="text-white text-sm md:text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {services.map((service, index) => {
            const isExpanded = expanded === index;
            const reverse = index % 2 !== 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5 }}
                className={`flex flex-col md:flex-row ${reverse ? "md:flex-row-reverse" : ""} items-stretch gap-6`}
              >
                {/* Tarjeta */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-campomaq hover:border-yellow-400 transition-all duration-300 flex-1 flex flex-col relative">
                  {/* Botón ver más mobile */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : index)}
                    className="absolute top-4 right-4 md:hidden p-1 rounded-full bg-black hover:bg-campomaq"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  <div className="flex items-center mb-4">
                    <div className="bg-campomaq text-black w-14 h-14 rounded-full flex items-center justify-center mr-4">{service.icon}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-black">{service.title}</h3>
                  </div>

                  {/* Desktop: siempre visible */}
                  <p className="hidden md:block text-gray-600 mb-4">{service.description}</p>
                  <ul className="hidden md:block space-y-2 mt-auto">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mr-2" />{f}
                      </li>
                    ))}
                  </ul>

                  {/* Mobile: expandible */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden"
                      >
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <ul className="space-y-2">
                          {service.features.map((f, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 mr-2" />{f}
                            </li>
                          ))}
                        </ul>
                        <a
                          href="https://wa.me/593XXXXXXXXX"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600 transition-colors"
                        >
                          <FaWhatsapp className="text-lg" /> Contáctanos
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Botón contacto siempre visible en desktop */}
                  <div className="hidden md:flex mt-6">
                    <a
                      href="https://wa.me/593XXXXXXXXX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <FaWhatsapp className="text-lg" /> Contáctanos
                    </a>
                  </div>
                </div>

                {/* Video */}
                <div 
                  className="flex-1 w-full relative"
                  onMouseEnter={() => setHoveredVideo(index)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg relative group">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${service.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${service.videoId}`}
                      title={`Video demostrativo - ${service.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                    
                    {/* Overlay para redirección a YouTube */}
                    <a
                      href={`https://www.youtube.com/watch?v=${service.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300 ${hoveredVideo === index ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <div className="bg-red-600 text-white p-3 rounded-full flex items-center justify-center">
                        <FaYoutube className="text-2xl" />
                        <span className="ml-2 font-medium">Ver en YouTube</span>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experiencias reales de agricultores y profesionales que confían en nuestros servicios</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="bg-campomaq w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-black">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
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