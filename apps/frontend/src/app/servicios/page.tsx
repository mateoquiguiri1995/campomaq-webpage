'use client';

import { memo, useMemo, useRef, useState, useEffect } from "react";
import type { ComponentType } from "react";
import { motion, useInView } from "framer-motion";
import { Wrench, Truck, Headphones, Shield, Clock, Users, Check, ChevronDown, ChevronUp, MapPin, Phone, Zap, Award } from "lucide-react";
import Image from "next/image";

/****************************
 * 1) Utilidades de rendimiento
 ****************************/

/****************************
 * 2) Contador animado (ligero)
 ****************************/
const AnimatedCounter = memo(({ target, duration = 1.2 }: { target: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const numericTarget = parseInt(target.replace(/\D/g, ""));
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * numericTarget));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  const format = (n: number) => {
    if (target.includes("+")) return `${n}+`;
    if (target.includes("/")) return `${n}/7`;
    if (target.includes("%")) return `${n}%`;
    return String(n);
  };

  return <span ref={ref}>{format(count)}</span>;
});
AnimatedCounter.displayName = "AnimatedCounter";

/**********************************************
 * 3) Lite YouTube
 **********************************************/
interface LiteYouTubeProps {
  id: string;
  title: string;
}

const LiteYouTube = memo(({ id, title }: LiteYouTubeProps) => {
  const [activated, setActivated] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const url = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&playsinline=1`;

  const onActivate = () => setActivated(true);

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
      {!activated ? (
        <button
          type="button"
          aria-label={`Reproducir video: ${title}`}
          onClick={onActivate}
          className="group absolute inset-0 w-full h-full cursor-pointer"
        >
          <Image
            src={thumb}
            alt="Miniatura del video"
            width={1280}
            height={720}
            loading="lazy"
            unoptimized
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={url}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  );
});
LiteYouTube.displayName = "LiteYouTube";

/****************************
 * 4) Componente de Restricción Minimalista
 ****************************/
const RestrictionBadge = ({ text, details }: { text: string; details?: string }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="inline-flex items-center gap-1 bg-amber-100 border border-amber-200 text-amber-800 px-2 py-1 rounded text-xs font-medium hover:bg-amber-200 transition-colors cursor-help"
      >
        <span>{text}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </button>
      
      {showDetails && details && (
        <div className="absolute z-10 top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-700">{details}</p>
          <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45" />
        </div>
      )}
    </div>
  );
};

/****************************
 * 5) Componente Servicio Mejorado - 2 por fila alternados
 ****************************/

type IconType = ComponentType<{ className?: string }>;

interface ServiceItem {
  icon: IconType;
  title: string;
  description: string;
  features: string[];
  restrictions: { text: string; details?: string };
  videoId: string;
}

const ServiceCard = ({ service, index, isReversed }: { service: ServiceItem; index: number; isReversed: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8"
    >
      {/* Desktop Layout - 2 columnas alternadas */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-8">
        {/* Contenido de texto */}
        <div className={`p-8 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-black rounded-lg p-3">
              <Icon className="w-7 h-7 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{service.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <RestrictionBadge 
                  text={service.restrictions.text} 
                  details={service.restrictions.details} 
                />
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>
          
          <ul className="space-y-3 mb-8">
            {service.features.map((feature: string, idx: number) => (
              <li key={idx} className="flex items-center text-gray-600">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/593980582555"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Solicitar Servicio
          </a>
        </div>

        {/* Video */}
        <div className={`p-8 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
          <LiteYouTube id={service.videoId} title={`Video - ${service.title}`} />
        </div>
      </div>

      {/* Mobile Layout - Colapsable */}
      <div className="lg:hidden">
        {/* Header - Siempre visible */}
        <div 
          className="p-6 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-black rounded-lg p-2">
                <Icon className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <RestrictionBadge 
                    text={service.restrictions.text} 
                    details={service.restrictions.details} 
                  />
                </div>
              </div>
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </div>
        </div>

        {/* Contenido - Colapsable en mobile */}
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <p className="text-gray-700 mb-6 leading-relaxed pt-6">{service.description}</p>
            
            <ul className="space-y-2 mb-6">
              {service.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center text-gray-600 text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mb-6">
              <LiteYouTube id={service.videoId} title={`Video - ${service.title}`} />
            </div>

            <a
              href="https://wa.me/593980582555"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors w-full"
            >
              Solicitar Servicio
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/****************************
 * 6) Sección de Cobertura Geográfica
 ****************************/
const CoverageSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Cobertura
          <span className="block text-yellow-400">Nacional</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Servicios técnicos disponibles en las principales zonas agrícolas del Ecuador
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { province: "Pichincha", cities: ["Cayambe", "Tabacundo", "Pedro Moncayo"], icon: MapPin },
          { province: "Imbabura", cities: ["Ibarra", "Otavalo", "Cotacachi"], icon: MapPin },
          { province: "Cotopaxi", cities: ["Latacunga", "Salcedo", "Saquisilí"], icon: MapPin },
          { province: "Tungurahua", cities: ["Ambato", "Pelileo", "Baños"], icon: MapPin },
        ].map((region, index) => {
          const Icon = region.icon;
          return (
            <motion.div
              key={region.province}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center"
            >
              <div className="bg-black rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">{region.province}</h3>
              <ul className="space-y-1">
                {region.cities.map((city, idx) => (
                  <li key={idx} className="text-sm text-gray-600">{city}</li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <p className="text-gray-600 mb-6">
          ¿No encuentras tu ubicación? Contáctanos para verificar cobertura en tu zona.
        </p>
        <a
          href="https://wa.me/593980582555"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
        >
          <Phone className="w-5 h-5" />
          Consultar Cobertura
        </a>
      </motion.div>
    </div>
  </section>
);

/****************************
 * 7) Sección de Certificaciones y Garantías
 ****************************/
const CertificationsSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Certificaciones y
          <span className="block text-yellow-400">Garantías</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Respaldados por las principales marcas y con garantías extendidas
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "Técnicos Certificados",
            description: "Personal con certificaciones oficiales de las marcas que representamos",
            icon: Award,
            features: ["Husqvarna", "Maruyama", "Briggs & Stratton", "STIHL"]
          },
          {
            title: "Garantía Extendida",
            description: "Servicios y repuestos con garantía extendida hasta 12 meses",
            icon: Shield,
            features: ["Repuestos originales", "Mano de obra garantizada", "Soporte post-venta"]
          },
          {
            title: "Respuesta Rápida",
            description: "Sistema de atención prioritaria para emergencias técnicas",
            icon: Zap,
            features: ["Respuesta en 24h", "Soporte telefónico", "Visitas programadas"]
          }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 border border-gray-200"
            >
              <div className="bg-black rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <ul className="space-y-2">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/****************************
 * 8) Datos memoizados
 ****************************/
const useData = () => {
  const stats = useMemo(
    () => [
      { number: "20+", label: "Años de Experiencia", icon: Clock },
      { number: "1000+", label: "Clientes Satisfechos", icon: Users },
      { number: "24/", label: "Atención en línea", icon: Headphones }, 
      { number: "100%", label: "Garantía", icon: Shield },
    ],
    []
  );

  const services = useMemo(
    () => [
      {
        icon: Wrench,
        title: "Servicio Técnico en Campo",
        description: "Nuestros técnicos certificados se trasladan hasta tu cultivo para realizar mantenimiento y reparaciones en el lugar, evitando que tu trabajo se detenga.",
        features: [
          "Diagnóstico especializado",
          "Reparación garantizada",
          "Mantenimiento preventivo",
          "Certificaciones oficiales",
        ],
        restrictions: {
          text: "Se aplican restricciones",
          details: "El servicio en campo aplica para zonas dentro de un radio de 50km desde nuestras sucursales. Para distancias mayores, consultar tarifas especiales."
        },
        videoId: "T2DXpm3xXCM",
      },
      {
        icon: Truck,
        title: "Entrega y Logística",
        description: "Enviamos tus equipos y repuestos a cualquier parte del país. Para la zona florícola ofrecemos transporte e instalación sin costo en equipos seleccionados.",
        features: [
          "Envíos a todo el país", 
          "Transporte e instalacion sin costo",
          "Instalación en el sitio", 
          "Cobertura nacional"
        ],
        restrictions: {
          text: "Condiciones especiales",
          details: "Transporte gratuito aplica para pedidos superiores a $500 en zona florícola. Instalación incluida en equipos seleccionados."
        },
        videoId: "F4wYJjBu-7Y",
      },
      {
        icon: Headphones,
        title: "Asesoría y Capacitación Técnica",
        description: "Ofrecemos asesoramiento especializado para capacitar al personal técnico de tu florícola o cultivo.",
        features: [
          "Asesoría personalizada", 
          "Análisis de necesidades", 
          "Comparativas técnicas", 
          "Recomendaciones expertas"
        ],
        restrictions: {
          text: "Programación requerida",
          details: "Las capacitaciones requieren agenda previa. Mínimo 3 participantes para grupos."
        },
        videoId: "Bgg3ynClrsk",
      },
      {
        icon: Shield,
        title: "Servicio de Torno y Soldadura",
        description: "Contamos con torno y soldadura especializada para fabricar y reparar las piezas que necesite.",
        features: [
          "Torno", 
          "Sueldas especiales", 
          "Fabricación de piezas"
        ],
        restrictions: {
          text: "Tiempos de fabricación",
          details: "Tiempos de entrega varían según complejidad de la pieza. Materiales no incluidos."
        },
        videoId: "Jm0WtfD5Gek",
      },
    ],
    []
  );

  return { stats, services };
};

/****************************
 * 9) Página principal
 ****************************/
export default function ServiciosPage() {
  const { stats, services } = useData();

  return (
    <main className="min-h-screen pt-20 overflow-hidden">
      {/* HERO MINIMALISTA CON VIDEO DE FONDO */}
      <section className="relative h-screen flex items-center justify-center bg-black">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/videos/servicios.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            Servicios
            <span className="block text-yellow-400">Especializados</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Soluciones técnicas profesionales para el sector agrícola ecuatoriano
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-yellow-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* STATS - MANTENIENDO DISEÑO ORIGINAL */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-2 grid size-12 place-items-center rounded-lg bg-black text-yellow-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-black">
                    <AnimatedCounter target={s.number} />
                  </div>
                  <div className="text-gray-600 text-sm font-medium">{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICIOS - 2 POR FILA ALTERNADOS */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Nuestros
              <span className="block text-yellow-400">Servicios</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Soluciones profesionales diseñadas para maximizar la productividad de tu operación
            </p>
          </motion.div>

          <div className="space-y-0">
            {services.map((service, index) => (
              <ServiceCard 
                key={service.title} 
                service={service} 
                index={index}
                isReversed={index % 2 !== 0} // Alterna el orden
              />
            ))}
          </div>
        </div>
      </section>

      {/* NUEVAS SECCIONES EN LUGAR DE TESTIMONIOS */}
      <CoverageSection />
      <CertificationsSection />
    </main>
  );
}