import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

const socialLinks = [
  { name: "Facebook", icon: <FaFacebookF />, url: "https://www.facebook.com/campomaqoficial/?locale=es_LA" },
  { name: "Instagram", icon: <FaInstagram />, url: "https://www.instagram.com/campomaq/" },
  { name: "YouTube", icon: <FaYoutube />, url: "https://www.youtube.com/@campomaq9918" },
];

const quickLinks = [
  { name: "Productos", url: "/productos" },
  { name: "Servicios", url: "/servicios" },
  { name: "Nosotros", url: "/nosotros" },
  { name: "Contacto", url: "/contacto" },
];

const productCategories = [
  { name: "Motocultores", url: "/productos?search=motocultor" },
  { name: "Desbrozadoras", url: "/productos?search=desbrozadora" },
  { name: "Bombas de Fumigación", url: "/productos?search=Bombas de Fumigar" },
  { name: "Servicio Técnico", url: "/servicios" },
];

export default function Footer() {
  return (
    <footer className="relative text-white bg-black min-h-fit">
      
      <div className="relative z-10">
        {/* Sección principal */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Logo y descripción */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <div className="relative w-48 h-20 mb-4 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                  <Image
                    src="/campo_maq.svg"
                    alt="Campomaq Logo"
                    fill
                    sizes="192px"
                    className="object-contain"
                  />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Más de 20 años especializados en maquinaria agrícola y equipos de alta calidad para el sector florícola.
                </p>
              </div>
              
              {/* Redes sociales */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                  Síguenos
                </h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-campomaq hover:text-black transition-all duration-300 transform hover:scale-110 hover:shadow-lg backdrop-blur-sm"
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 relative">
                Navegación
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-campomaq"></div>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="text-gray-300 hover:text-campomaq transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Productos */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 relative">
                Productos
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-campomaq"></div>
              </h3>
              <ul className="space-y-3">
                {productCategories.map((category, index) => (
                  <li key={index}>
                    <Link
                      href={category.url}
                      className="text-gray-300 hover:text-campomaq transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 relative">
                Contacto
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-campomaq"></div>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-campomaq mt-1 flex-shrink-0" size={14} />
                  <div className="text-gray-300 text-sm">
                    <p>Calle Venezuela OE4-64 y Sergio Mejía</p>
                    <p>Cayambe, Quito, Ecuador</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-campomaq flex-shrink-0" size={14} />
                  <Link 
                    href="tel:+59322110537"
                    className="text-gray-300 hover:text-campomaq transition-colors text-sm"
                  >
                    (02) 2110537
                  </Link>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-campomaq flex-shrink-0" size={14} />
                  <Link 
                    href="mailto:ventas@campomaq.com.ec"
                    className="text-gray-300 hover:text-campomaq transition-colors text-sm"
                  >
                    ventas@campomaq.com.ec
                  </Link>
                </div>

                <div className="pt-2">
                  <div className="flex items-start space-x-3 mb-2">
                    <FaClock className="text-campomaq mt-1 flex-shrink-0" size={14} />
                    <div className="text-gray-300 text-sm">
                      <h4 className="font-semibold text-white mb-1">Horarios</h4>
                      <p>Lun - Vie: 8:00 AM - 17:30 PM</p>
                      <p>Sábados: 8:00 AM - 12:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/20"></div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Campo Maq. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}