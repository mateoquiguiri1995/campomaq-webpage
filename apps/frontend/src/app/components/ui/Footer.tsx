import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const socialLinks = [
  { name: "Facebook", icon: <FaFacebookF />, url: "#" },
  { name: "Instagram", icon: <FaInstagram />, url: "#" },
  { name: "LinkedIn", icon: <FaLinkedinIn />, url: "#" },
  { name: "YouTube", icon: <FaYoutube />, url: "#" },
];

const quickLinks = [
  { name: "Inicio", url: "/" },
  { name: "Productos", url: "/productos" },
  { name: "Servicios", url: "/servicios" },
  { name: "Nosotros", url: "/nosotros" },
  { name: "Contacto", url: "/contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-700 pb-12">
        
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
          <p className="mb-6 leading-relaxed">
            Distribuidores líderes de maquinaria agrícola y de jardinería con más de 20 años de experiencia en el mercado.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.url}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-500 hover:text-black transition-all duration-300 transform hover:scale-110"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2">
            Enlaces rápidos
          </h3>
          <ul className="space-y-3">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.url}
                  className="hover:text-yellow-500 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2">
            Contacto
          </h3>
          <address className="not-italic space-y-3 leading-relaxed">
            <p>Calle Venezuela OE4-64 y Sergio Mejía</p>
            <p>Cayambe, Quito, Ecuador</p>
            <p>Tel: (02) 1185008</p>
            <p>Email: ventasAle@campomaq.com</p>
          </address>
        </div>

        {/* Horarios */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2">
            Horario de atención
          </h3>
          <p className="mb-3">Lunes a Viernes: 7:30 AM - 17:30 PM</p>
          <p>Sábados: 7:30 AM - 13:00 PM</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Campomaq. Todos los derechos reservados.
      </div>
    </footer>
  );
}
