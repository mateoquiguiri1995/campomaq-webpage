"use client";

import { memo, useMemo, useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Wrench, Truck, Headphones, Shield, Clock, Users, Check, Star } from "lucide-react";

/****************************
 * 1) Utilidades de rendimiento
 ****************************/
const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
};

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
 * 3) Lite YouTube (evita CSS/JS de YouTube hasta interactuar)
 *    - Evita el warning de -ms-high-contrast del iframe inicial
 *    - Carga diferida con thumbnail
 **********************************************/
interface LiteYouTubeProps {
  id: string;
  title: string;
  linkLabel?: string;
}

const LiteYouTube = memo(({ id, title, linkLabel = "Ver en YouTube" }: LiteYouTubeProps) => {
  const [activated, setActivated] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const url = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&playsinline=1`;

  // Accesibilidad con teclado
  const onActivate = () => setActivated(true);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActivated(true);
    }
  };

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60">
      {!activated ? (
        <button
          type="button"
          aria-label={`Reproducir video: ${title}`}
          onClick={onActivate}
          onKeyDown={onKey}
          className="group absolute inset-0 w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
        >
          {/* Thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt="Miniatura del video"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          {/* Overlay + botón play */}
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-4 mx-auto w-fit">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold shadow backdrop-blur-md group-hover:bg-white">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              Reproducir
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <a
              href={`https://www.youtube.com/watch?v=${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-black/60 px-3 py-1 text-xs text-white hover:bg-black/80"
            >
              {linkLabel}
            </a>
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
      <noscript>
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className="text-white underline">{title}</a>
      </noscript>
    </div>
  );
});
LiteYouTube.displayName = "LiteYouTube";

/****************************
 * 4) Datos memoizados
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
        description:
          "Nuestros técnicos certificados se trasladan hasta tu cultivo para realizar mantenimiento y reparaciones en el lugar, evitando que tu trabajo se detenga. Especialmente pensado para florícolas y agricultores que no pueden interrumpir sus jornadas de fumigación y producción.",
        features: [
          "Diagnóstico especializado",
          "Reparación garantizada",
          "Mantenimiento preventivo",
          "Certificaciones oficiales",
        ],
        videoId: "T2DXpm3xXCM",
      },
      {
        icon: Truck,
        title: "Entrega y Logística",
        description:
          "Enviamos tus equipos y repuestos a cualquier parte del país. Para la zona florícola ofrecemos transporte e instalación sin costo en equipos seleccionados, garantizando una entrega segura, puntual y con el respaldo que tu cultivo necesita.",
        features: ["Envíos a todo el país", "Transporte e instalacion sin costo. (Aplica restricciones)", "Instalación en el sitio", "Cobertura nacional"],
        videoId: "F4wYJjBu-7Y",
      },
      {
        icon: Headphones,
        title: "Asesoría y Capacitación Técnica",
        description:
          "Ofrecemos asesoramiento especializado para capacitar al personal técnico de tu florícola o cultivo. Acompañamos a tus mecánicos con comparativas, recomendaciones y formación práctica para que tus equipos trabajen siempre al máximo rendimiento.",
        features: ["Asesoría personalizada", "Análisis de necesidades", "Comparativas técnicas", "Recomendaciones expertas"],
        videoId: "Bgg3ynClrsk",
      },
      {
        icon: Shield,
        title: "Servicio de Torno y Soldadura",
        description:
          "Contamos con torno y soldadura especializada para fabricar y reparar las piezas que necesite. Proveemos bocines, reparamos componentes y elaboramos lanzas de fumigación en acero inoxidable, asegurando que tu equipo siempre tenga solución.",
        features: ["Torno", "Sueldas especiales", "Fabricación de piezas"],
        videoId: "Jm0WtfD5Gek",
      },
      {
        icon: Users,
        title: "Capacitación",
        description:
          "Programas de capacitación integral para el uso correcto, mantenimiento y optimización de la maquinaria agrícola con certificación oficial.",
        features: ["Capacitación técnica", "Manuales de uso", "Videos instructivos", "Sesiones prácticas"],
        videoId: "tpCoTL4mtO4",
      },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: "José Vicente Panoluisa Proaño",
        role: "Agricultor",
        content:
          "El servicio es exelente la atención están pendiente sobre los productos que distribuyen",
        rating: 5,
        location: "Cayambe, Ecuador",
        avatar: "JP",
      },
      {
        name: "Jhonny David Aguilar Tabango",
        role: "Agricultor",
        content:
          "Buena atención",
        rating: 5,
        location: "Cayambe, Ecuador",
        avatar: "JA",
      },
    ],
    []
  );

  return { stats, services, testimonials };
};

/****************************
 * 5) Página principal
 ****************************/
export default function NosotrosPage() {
  const { stats, services, testimonials } = useData();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const reduced = usePrefersReducedMotion();

  return (
    <main className="min-h-screen pt-20 overflow-hidden">
      {/* HERO */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 -z-10" style={{ y: reduced ? 0 : yBg }}>
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-yellow-200" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Elementos flotantes simplificados (sin blur pesado) */}
          {!reduced && (
            <>
              <motion.div
                className="absolute top-1/4 left-1/4 size-24 md:size-32 bg-yellow-500/20 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 size-20 md:size-24 bg-yellow-400/20 rounded-full"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.35, 0.6, 0.35] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}
        </motion.div>

        <div className="relative z-10 px-6 text-center max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight"
          >
            <span className="block">NUESTROS</span>
            <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
              SERVICIOS
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-base md:text-xl text-white/90"
          >
            Soluciones integrales para el campo y jardinería con el respaldo de
            <span className="font-semibold text-yellow-300"> más de 20 años de experiencia</span>
          </motion.p>
        </div>
      </section>

      {/* STATS */}
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

      {/* SERVICIOS */}
      <section id="servicios" className="py-16 md:py-20 bg-black">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">Nuestros Servicios</h2>
            <div className="mx-auto mb-3 h-1 w-20 bg-yellow-400" />
            <p className="mx-auto max-w-2xl text-gray-300">Soluciones profesionales para maximizar tu productividad</p>
          </motion.div>

          <div className="space-y-10 md:space-y-12">
            {services.map((service, index) => {
              const reverse = index % 2 !== 0;
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className={`flex flex-col lg:flex-row ${reverse ? "lg:flex-row-reverse" : ""} gap-6`}
                >
                  {/* Texto */}
                  <div className="flex-1">
                    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-white p-6 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid size-12 place-items-center rounded-lg bg-yellow-300 text-black">
                            <Icon className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-black">{service.title}</h3>
                        </div>
                      </div>
                      <p className="mb-4 text-gray-700">{service.description}</p>
                      <ul className="mb-6 space-y-2">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-center text-sm text-gray-800">
                            <span className="mr-3 grid size-4 flex-shrink-0 place-items-center rounded-full bg-yellow-200">
                              <Check className="h-3 w-3 text-black" />
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto">
                        <a
                          href="https://wa.me/593XXXXXXXXX"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-300 px-5 py-3 font-semibold text-black transition hover:bg-yellow-400 md:w-auto"
                        >
                          Solicitar Servicio
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Video (Lite) */}
                  <div className="flex-1">
                    <LiteYouTube id={service.videoId} title={`Video - ${service.title}`} linkLabel="YouTube" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/10 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              TESTIMONIOS
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">REALES</span>
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Experiencias auténticas de agricultores y profesionales que confían en nuestros servicios
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="group relative"
              >
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-20" />
                <div className="relative h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-3 flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`mr-1 h-5 w-5 ${j < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <blockquote className="mb-6 flex-grow italic leading-relaxed text-gray-700">“{t.content}”</blockquote>
                  <div className="flex items-center">
                    <div className="mr-4 grid size-12 place-items-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 font-bold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{t.name}</h4>
                      <p className="text-xs text-gray-500">{t.role}</p>
                      <p className="text-xs text-gray-400">{t.location}</p>
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
