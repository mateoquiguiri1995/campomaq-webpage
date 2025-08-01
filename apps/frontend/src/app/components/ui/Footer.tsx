import Image from 'next/image'
import Link from 'next/link'

const socialLinks = [
  { name: 'Facebook', icon: '/social/facebook.svg', url: '#' },
  { name: 'Instagram', icon: '/social/instagram.svg', url: '#' },
  { name: 'LinkedIn', icon: '/social/linkedin.svg', url: '#' },
  { name: 'YouTube', icon: '/social/youtube.svg', url: '#' }
]

const quickLinks = [
  { name: 'Inicio', url: '/' },
  { name: 'Productos', url: '/productos' },
  { name: 'Servicios', url: '/servicios' },
  { name: 'Nosotros', url: '/nosotros' },
  { name: 'Contacto', url: '/contacto' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo y descripción */}
        <div>
          <div className="relative w-48 h-10 mb-6">
            <Image 
              src="/campomaq.png" 
              alt="Campomaq Logo" 
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <p className="mb-6">
            Distribuidores líderes de maquinaria agrícola y de jardinería con más de 20 años de experiencia en el mercado.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <Link key={index} href={social.url} className="hover:text-yellow-500 transition-colors">
                <div className="relative w-6 h-6">
                  <Image 
                    src={social.icon}
                    alt={social.name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">Enlaces rápidos</h3>
          <ul className="space-y-3">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.url} className="hover:text-yellow-500 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">Contacto</h3>
          <address className="not-italic space-y-3">
            <p>Calle Venezuela OE4-64 y Sergio Mejía</p>
            <p>Cayambe, Quito, Ecuador</p>
            <p>Tel: (02) 1185008</p>
            <p>Email: ventasAle@campomaq.com</p>
          </address>
        </div>

        {/* Horario y newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">Horario de atención</h3>
          <p className="mb-3">Lunes a Viernes: 7:30 AM - 17:30 PM</p>
          <p className="mb-6">Sábados: 7:30 AM - 13:00 PM</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
        <p>© {new Date().getFullYear()} Campomaq. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}