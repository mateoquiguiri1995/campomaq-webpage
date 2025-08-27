import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const socialLinks = [
  { name: "Facebook", icon: <FaFacebookF />, url: "https://www.facebook.com/campomaqoficial/?locale=es_LA" },
  { name: "Instagram", icon: <FaInstagram />, url: "https://www.instagram.com/campomaq/" },
  { name: "YouTube", icon: <FaYoutube />, url: "https://www.youtube.com/@campomaq9918" },
];

const quickLinks = [
  { name: "Productos", url: "/productos" },
  { name: "Servicios", url: "/servicios" },
  { name: "Nosotros", url: "/nosotros" },
];

export default function Footer() {
  return (
    <footer className="relative text-gray-300 pt-25 pb-12 px-6 overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/bg/volcan.jpg"
          alt="Volcán Cayambe"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-700 pb-16">
        {/* Logo y descripción */}
        <div>
          <div className="relative w-50 h-50 top-0 left-1/2 transform -translate-x-1/2 mb-6">
            <Image
              src="/campo_maq.svg"
              alt="Campomaq Logo"
              fill
              sizes='w-150px h-150px'
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="flex space-x-6 justify-center mb-6 pt-0 mt-0">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.url}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-campomaq hover:text-black transition-all duration-300 transform hover:scale-110"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 border-b border-white pb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            Enlaces rápidos
          </h3>
          <ul className="space-y-3">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.url}
                  className="hover:text-campomaq transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,1)]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 border-b white pb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            Contacto
          </h3>
          <address className="not-italic space-y-3 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <p>Calle Venezuela OE4-64 y Sergio Mejía</p>
            <p>Cayambe, Quito, Ecuador</p>
            <p>Tel: (02) 2110537</p>
            <p>Email: ventas@campomaq.com.ec</p>
          </address>
        </div>

        {/* Horarios */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 border-b white pb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            Horario de atención
          </h3>
          <p className="mb-3 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
            Lunes a Viernes: 8:00 AM - 17:30 PM
          </p>
          <p className="drop-shadow-[0_2px_3px_rgba(0,5,5,5)]">
            Sábados: 8:00 AM - 12:30 PM
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm text-gray-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-bold">
        © {new Date().getFullYear()} Campo Maq
      </div>
    </footer>
  );
}
