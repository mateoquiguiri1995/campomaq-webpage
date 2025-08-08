'use client';
import { motion } from 'framer-motion';
import { Wrench, Truck, Headphones, Shield, Clock, Users } from 'lucide-react';

const services = [
  {
    icon: <Wrench className="w-8 h-8" />,
    title: "Servicio Técnico Especializado",
    description: "Contamos con técnicos certificados por las principales marcas para brindarte el mejor servicio post-venta y mantenimiento preventivo.",
    features: ["Diagnóstico especializado", "Reparación garantizada", "Mantenimiento preventivo", "Certificaciones oficiales"]
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Entrega y Logística",
    description: "Servicio de entrega a domicilio en todo el país con seguimiento en tiempo real y garantía de entrega segura.",
    features: ["Entrega a domicilio", "Seguimiento en tiempo real", "Embalaje seguro", "Cobertura nacional"]
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: "Asesoría Técnica",
    description: "Asesoramiento especializado para ayudarte a elegir la mejor maquinaria según tus necesidades específicas.",
    features: ["Asesoría personalizada", "Análisis de necesidades", "Comparativas técnicas", "Recomendaciones expertas"]
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Garantía Extendida",
    description: "Garantías extendidas en todos nuestros productos con cobertura completa y soporte técnico incluido.",
    features: ["Garantía extendida", "Cobertura completa", "Soporte técnico", "Repuestos originales"]
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Servicio 24/7",
    description: "Atención al cliente disponible las 24 horas del día, 7 días a la semana para emergencias técnicas.",
    features: ["Atención 24/7", "Emergencias técnicas", "Respuesta rápida", "Soporte continuo"]
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Capacitación",
    description: "Programas de capacitación para el uso correcto y mantenimiento de la maquinaria agrícola.",
    features: ["Capacitación técnica", "Manuales de uso", "Videos instructivos", "Sesiones prácticas"]
  }
];

const stats = [
  { number: "20+", label: "Años de Experiencia" },
  { number: "50K+", label: "Clientes Satisfechos" },
  { number: "24/7", label: "Soporte Técnico" },
  { number: "100%", label: "Garantía" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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

export default function ServiciosPage() {
  return (
    <main className="min-h-screen pt-28 bg-gradient-to-b from-yellow-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-black mb-6"
          >
            Nuestros Servicios
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto"
          >
            Soluciones integrales para el campo y jardinería con el respaldo de más de 20 años de experiencia
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-6xl font-bold text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-white text-sm md:text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200 hover:border-yellow-400 transition-all duration-300"
              >
                <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              ¿Necesitas Asesoría?
            </h2>
            <p className="text-xl text-black/80 mb-8">
              Nuestro equipo de expertos está listo para ayudarte a encontrar la mejor solución para tus necesidades
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-yellow-400 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-colors"
            >
              Contactar Ahora
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
