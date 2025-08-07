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
    <footer className="relative text-gray-300 pt-70 pb-12 px-6 overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/bg/cayambe.jpg"
          alt="Volcán Cayambe"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Degradado oscuro inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
        {/* Degradado superior celeste a blanco */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-blue-100/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-700 pb-16">
        {/* Logo y descripción */}
        <div>
          <div className="relative w-48 h-12 mb-6">
            <Image
              src="/campomaq.png"
              alt="Campomaq Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <p className="font-bold mb-6 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Distribuidores líderes de maquinaria agrícola y de jardinería con más de 20 años de experiencia en el mercado.
          </p>
          <div className="flex space-x-4">
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
            <p>Tel: (02) 1185008</p>
            <p>Email: ventasAlex@campomaq.com</p>
          </address>
        </div>

        {/* Horarios */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 border-b white pb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            Horario de atención
          </h3>
          <p className="mb-3 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
            Lunes a Viernes: 7:30 AM - 17:30 PM
          </p>
          <p className="drop-shadow-[0_2px_3px_rgba(0,5,5,5)]">
            Sábados: 7:30 AM - 13:00 PM
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm text-gray-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-bold">
        © {new Date().getFullYear()} Campomaq. Todos los derechos reservados.
      </div>
    </footer>
  );
}
