'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Detecta scroll para cambiar estilo
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cierra menú al navegar
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Oculta búsqueda en /productos
  const isProductsPage = pathname.startsWith('/productos')
  const [searchInput, setSearchInput] = useState("");
  const categories = [
    { name: 'Bombeo', sub: ['Bombas de agua', 'Motobombas', 'Hidrolavadoras'] },
    { name: 'Bosque y Jardín', sub: ['Motosierras', 'Podadoras', 'Cortasetos'] },
    { name: 'Energía', sub: ['Generadores', 'Inversores', 'Paneles solares'] },
    { name: 'Hélices', sub: ['Hélices metálicas', 'Hélices plásticas'] },
    { name: 'Fumigación', sub: ['Fumigadoras manuales', 'Fumigadoras motorizadas'] },
    { name: 'Motores', sub: ['Motores gasolina', 'Motores diésel'] },
    { name: 'Lubricantes', sub: ['Aceites', 'Grasas', 'Aditivos'] },
    { name: 'Repuestos y Accesorios', sub: ['Filtros', 'Cuchillas', 'Correas'] },
    { name: 'Marcas', sub: ['Honda', 'Stihl', 'Kawasaki'] },
  ]

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-black'
      }`}
    >
      {/* DESKTOP ≥ 825px */}
      <nav className="hidden min-[825px]:flex max-w-7xl mx-auto px-4 lg:px-8 h-24 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="relative w-[222px] h-[222px] min-w-[140px]">
            <Image
              src="/campo_maq.svg"
              alt="Campomaq Logo"
              fill
            
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </Link>

        {/* Menú principal */}
        <ul
          className={`flex text-lg font-semibold transition-all duration-200 ${
            scrolled ? 'text-black' : 'text-campomaq'
          }`}
          style={{
            gap: 'clamp(8px, 2vw, 30px)'
          }}
        >
          <li onMouseEnter={() => setShowCategories(false)}>
            <Link href="/nosotros">Nosotros</Link>
          </li>
          <li
            className="relative"
            onMouseEnter={() => setShowCategories(true)}
          >
            <Link href="/productos">Productos</Link>

            {/* Panel categorías */}
            <AnimatePresence>
              {showCategories && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="fixed left-1/2 -translate-x-1/2 top-[96px] mt-2
                  bg-white text-black rounded-lg shadow-2xl border border-gray-200
                  w-screen px-4 sm:px-8 z-50"
                  onMouseLeave={() => setShowCategories(false)}
                  onMouseEnter={() => setShowCategories(true)}
                >
                  <div
                    className="grid gap-x-6 gap-y-4 py-6"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
                    }}
                  >
                    {categories.map((cat) => (
                      <div
                        key={cat.name}
                        className="border-l border-gray-200 first:border-none pl-4"
                      >
                        <h3 className="font-bold text-gray-800 mb-2">{cat.name}</h3>
                        <ul className="space-y-1">
                          {cat.sub.map((s) => (
                            <li key={s}>
                              <Link
                                href={`/productos?categoria=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(s)}`}
                                className="text-gray-600 hover:text-campomaq text-sm"
                              >
                                {s}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
          <li onMouseEnter={() => setShowCategories(false)}>
            <Link href="/servicios">Servicios</Link>
          </li>
        </ul>

        {/* Botón de contacto + búsqueda */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="https://wa.me/593980582555?text=Hola%20quiero%20más%20información"
            target="_blank"
            className={`font-semibold px-4 py-2 rounded transition-colors ${
              scrolled
                ? 'bg-campomaq text-black hover:bg-black hover:text-campomaq hover:border-campomaq hover:border-2'
                : 'bg-campomaq text-black hover:bg-black hover:text-campomaq hover:border-campomaq hover:border-2'
            }`}
          >
            Contacto <FaWhatsapp className="inline-block ml-1" />
          </Link>

          {!isProductsPage && (
            <div className="flex items-center bg-white rounded px-2 py-1 w-[clamp(160px,20vw,240px)]">
              <input
                type="text"
                placeholder="Buscar..."
                className="outline-none text-black w-full text-sm"
              />
              <Search className="text-gray-500 w-5 h-5 shrink-0" />
            </div>
          )}
        </div>
      </nav>

      {/* TABLET 640px – 824px */}
      <div className="hidden min-[640px]:max-[824px]:flex flex-col px-4 py-3 shadow-md"
        style={{ backgroundColor: scrolled ? '#fff' : '#000' }}
      >
        <div className="flex items-center justify-between gap-2 h-16">
          <Link href="/" className="relative  w-[222px] h-[222px] min-w-[120px] shrink-0">
            <Image
              src="/campo_maq.svg"
              alt="Campomaq Logo"
              fill
              sizes='(max-width: 640px) 120px, (max-width: 824px) 120px, 140px'
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {!isProductsPage && (
            <div className="flex items-center bg-white rounded px-2 py-1 w-[clamp(140px,50%,220px)]">
              <input
                type="text"
                placeholder="Buscar..."
                className="outline-none text-black w-full text-sm"
              />
              <Search className="text-gray-500 w-4 h-4 shrink-0" />
            </div>
          )}

          <button onClick={() => setOpen(!open)} className={scrolled ? "text-black" : "text-campomaq"}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={`py-4 rounded shadow-lg flex justify-center gap-6 items-center ${
                scrolled ? 'bg-white text-black' : 'bg-black text-campomaq'
              }`}
            >
              <Link href="/nosotros">Nosotros</Link>
              <Link href="/productos">Productos</Link>
              <Link href="/servicios">Servicios</Link>
              <Link
                href="https://wa.me/593980582555?text=Hola%20quiero%20más%20información"
                target="_blank"
                className="bg-campomaq text-black font-semibold px-4 py-2 rounded hover:opacity-80"
              >
                Contacto <FaWhatsapp className="inline-block ml-1" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MÓVIL < 640px */}
      <div className="flex max-[639px]:flex sm:hidden flex-col px-4 py-3 shadow-md"
        style={{ backgroundColor: scrolled ? '#fff' : '#000' }}
      >
        <div className="flex items-center justify-between gap-2 h-16">
          <Link href="/" className="relative  w-[150px] h-[150px] min-w-[120px] shrink-0">
            <Image
              src="/campo_maq.svg"
              alt="Campomaq Logo"
              fill
              sizes='(max-width: 640px) 120px, (max-width: 824px) 140px, 120px'
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {!isProductsPage && (
            <div className="flex items-center bg-white rounded px-2 py-1 w-[clamp(140px,60%,220px)]">
              <input
                type="text"
                placeholder="Buscar..."
                className="outline-none text-black w-full text-sm"
              />
              <Search className="text-gray-500 w-4 h-4 shrink-0" />
            </div>
          )}

          <button onClick={() => setOpen(!open)} className={scrolled ? "text-black" : "text-campomaq"}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={`py-4 rounded shadow-lg flex flex-col items-center gap-4 ${
                scrolled ? 'bg-white text-black' : 'bg-black text-campomaq'
              }`}
            >
              <li><Link href="/nosotros">Nosotros</Link></li>
              <li><Link href="/productos">Productos</Link></li>
              <li><Link href="/servicios">Servicios</Link></li>
              <li>
                <Link
                  href="https://wa.me/593980582555?text=Hola%20quiero%20más%20información"
                  target="_blank"
                  className="bg-campomaq text-black font-semibold px-4 py-2 rounded hover:opacity-80"
                >
                  Contacto <FaWhatsapp className="inline-block ml-1" />
                </Link>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
