'use client';
import { motion } from 'framer-motion';
import { Users, Target, Eye, Award, MapPin, Phone, Clock } from 'lucide-react';
import Image from 'next/image';

const team = [
  {
    name: "Manuel Quiguiri",
    position: "Director General",
    image: "/images/features/agricola.jpg",
    description: "Más de 25 años de experiencia en el sector agrícola"
  },
  {
    name: "Alexandra Quiguiri",
    position: "Gerente Comercial",
    image: "/images/features/soporte.jpg",
    description: "Especialista en relaciones comerciales y atención al cliente"
  },
  {
    name: "Mateo Quiguiri",
    position: "Jefe Técnologico",
    image: "/images/features/agricola.jpg",
    description: "Técnico certificado con amplia experiencia en Tecnologias e Inventariado"
  }
];

const milestones = [
  { year: "2003", title: "Fundación", description: "Inicio de operaciones en Quito" },
  { year: "2008", title: "Expansión", description: "Traslado de Empresa a Cayambe" },
  { year: "2013", title: "Certificaciones", description: "Obtuvimos certificaciones oficiales de las principales marcas" },
  { year: "2015", title: "Cobertura Nacional", description: "Llegamos a todo el país con maquinaria de calidad" },
  { year: "2023", title: "20 Años", description: "Celebramos 20 años de servicio al sector agrícola" }
];

const values = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Excelencia",
    description: "Buscamos la excelencia en cada aspecto de nuestro servicio"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Confianza",
    description: "Construimos relaciones duraderas basadas en la confianza"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Calidad",
    description: "Ofrecemos solo productos de la más alta calidad"
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Innovación",
    description: "Siempre buscamos las mejores soluciones tecnológicas"
  }
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

export default function NosotrosPage() {
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
            Sobre Nosotros
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto"
          >
            Más de 20 años siendo líderes en la distribución de maquinaria agrícola y de jardinería en Ecuador
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
              <div className="bg-campomaq w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-4">Nuestra Misión</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Empresa comercial y de servicio dedicada a proveer equipos de calidad a los sectores agrícola y forestal a nivel nacional, brindando soluciones efectivas a las necesidades de nuestros clientes.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
              <div className="bg-campomaq w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-4">Nuestra Visión</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Consolidarnos como  empresa  líder en la comercialización de nuestros productos y servicio especializado con personal técnico competente que propone y ejecuta políticas de estandarización de procesos para la entrega de un servicio de calidad.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-campomaq mb-6">
              Nuestra Historia
            </h2>
            <p className="text-white text-xl">
              20 años de crecimiento y compromiso con el sector agrícola
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-yellow-400 h-full hidden md:block" />
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} text-center md:text-left`}>
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <div className="text-3xl font-bold text-campomaq text-shadow-md mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-black mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-campomaq rounded-full border-4 border-black" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Nuestros Valores
            </h2>
            <p className="text-gray-600 text-xl">
              Los principios que guían nuestro trabajo diario
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200 text-center"
              >
                <div className="bg-campomaq text-black w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-r from-campomaq to-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Nuestro Equipo
            </h2>
            <p className="text-black/80 text-xl">
              Profesionales comprometidos con tu éxito
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-black mb-2">{member.name}</h3>
                  <p className="text-black font-semibold mb-2">{member.position}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-campomaq mb-6">
              Nuestra Empresa
            </h2>
            <p className="text-white text-xl">
              CAMPOMAQ nace con la finalidad de comercializar Maquinaria Agrícola, dar un Servicio Tecnico y ofrecer  Partes y Accesorios en todas las marcas, previamente seleccionada bajo las premisas de calidad, productividad y capacidad de satisfacer las necesidades, cada vez más cambiantes, del agricultor moderno.
              CAMPOMAQ es una empresa dinámica, habituada a cambiar constantemente su gama de productos en función de los nuevos desarrollos tecnológicos y las cada vez más exigentes, demandas de sus clientes.
              Para nosotros, es importante la satisfacción de nuestros clientes durante toda  la vida útil de nuestros productos. Por lo mismo, damos especial relevancia a nuestras áreas de servicio postventa, servicio técnico y recambios dentro de la propia estructura de la empresa.
              Nuestra vocación de servicio está encaminada hacia empresas agricultoras y otras que deseen adaptarse a las nuevas tecnologías de gestión agronómica del cultivo.
              Con nuestro trabajo queremos facilitar a nuestros clientes:
              Viables económicamente
              Adaptados a las distintas actualizaciones de maquinaria agricola
              y un soporte tecnico calificado
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
