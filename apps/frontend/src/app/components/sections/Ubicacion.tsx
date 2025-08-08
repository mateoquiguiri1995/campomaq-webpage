'use client'
import { motion } from 'framer-motion'

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

export default function Ubicacion() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12"
      >
        {/* Misión y Visión */}
        <motion.div variants={itemVariants} className="space-y-8">
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-yellow-50 p-8 rounded-lg border border-yellow-100 shadow-lg"
          >
            <div className="flex items-center mb-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-campomaq p-2 rounded-full mr-4"
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Misión</h3>
            </div>
            <p className="text-gray-700">
              Proveer maquinaria agrícola y de jardinería de la más alta calidad, ofreciendo soluciones integrales con servicio técnico especializado y soporte permanente a nuestros clientes.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-lg"
          >
            <div className="flex items-center mb-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-800 p-2 rounded-full mr-4"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Visión</h3>
            </div>
            <p className="text-gray-700">
              Ser reconocidos como el distribuidor líder de maquinaria agrícola y de jardinería en la región, destacando por nuestra excelencia en servicio, variedad de productos y compromiso con el desarrollo del sector.
            </p>
          </motion.div>
        </motion.div>

        {/* Mapa */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.8174471372245!2d-78.15103592581512!3d0.037906999961723406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2a08f8f22e24a5%3A0xd6b23f6070e0cef6!2sCampo%20Maq!5e0!3m2!1ses-419!2sar!4v1753915360898!5m2!1ses-419!2sar"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}