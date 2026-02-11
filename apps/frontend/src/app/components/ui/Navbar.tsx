'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Menu, X, Search, ChevronRight } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp, FaInstagram, FaFacebookF, FaYoutube, FaMapMarker, FaPhone, FaClock } from "react-icons/fa";

interface CategorySub {
  display: string;
  apiName: string;
}

interface Category {
  name: string;
  sub: CategorySub[];
  isBrands?: boolean;
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [showTopBar, setShowTopBar] = useState(true)
  const [showFloatingSocials, setShowFloatingSocials] = useState(false)
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [topBarHeight, setTopBarHeight] = useState(0) // Nueva state para altura dinámica
  const pathname = usePathname()
  const router = useRouter()
  const topBarRef = useRef<HTMLDivElement>(null)

  // Medir altura de la barra superior cuando cambie
  useEffect(() => {
    const measureTopBarHeight = () => {
      if (topBarRef.current) {
        setTopBarHeight(topBarRef.current.clientHeight)
      }
    }

    measureTopBarHeight()
    
    // Observer para cambios en el DOM
    const resizeObserver = new ResizeObserver(measureTopBarHeight)
    if (topBarRef.current) {
      resizeObserver.observe(topBarRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [])

  // Observer para detectar cuando el footer está visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    )

    const footer = document.querySelector('footer')
    if (footer) observer.observe(footer)

    return () => {
      if (footer) observer.unobserve(footer)
    }
  }, [])

  // Control de scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isAtTop = currentScrollY <= 10
      const isScrollingDown = currentScrollY > lastScrollY
      

      setScrolled(currentScrollY > 50)
      

      if (isAtTop) {
        setShowTopBar(true)
        setShowFloatingSocials(false)
      } else if (isScrollingDown && currentScrollY > 50) {
        setShowTopBar(false)
        setShowFloatingSocials(true)
      } else if (!isScrollingDown && currentScrollY < 50) {
        setShowTopBar(true)
        setShowFloatingSocials(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const handleSearch = () => {
    if (searchInput.trim()) {
      const q = searchInput.trim().toLowerCase()
      const searchQuery = encodeURIComponent(q)
      router.push(`/productos?brand=${searchQuery}`)
      setSearchInput("")
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const isProductsPage = pathname.startsWith('/productos')

  const categories: Category[] = [
    { 
      name: 'Motocultores', 
      sub: [
        { display: 'Motocultores', apiName: 'Motocultores' },
        { display: 'Mini Tractores', apiName: 'Mini Tractores Cortacésped' },
        { display: 'Motoazadas', apiName: 'Motoazadas' },
        { display: 'Accesorios', apiName: 'Accesorios Motocultores' }
      ]
    },
    { 
      name: 'Bosque y Jardín', 
      sub: [
        { display: 'Cortacesped', apiName: 'Cortacésped' },
        { display: 'Cortacetos', apiName: 'Cortacetos' },
        { display: 'Desbrozadoras', apiName: 'Desbrozadoras' },
        { display: 'Motosierras', apiName: 'Motosierras' },
        { display: 'Sopladoras', apiName: 'Sopladoras' },
        { display: 'Accesorios', apiName: 'Accesorios Desbrozadoras y Motosierras' }
      ]
    },
    { 
      name: 'Fumigación', 
      sub: [
        { display: 'Discos Fumigación', apiName: 'Discos fumigación' },
        { display: 'Fumigadoras manuales', apiName: 'Fumigadoras manuales' },
        { display: 'Fumigadoras motorizadas', apiName: 'Fumigadoras motorizadas' },
        { display: 'Espolvoreadoras', apiName: 'Espolvoreadores' },
        { display: 'Accesorios', apiName: 'Accesorios Bombas de fumigar' }
      ]
    },
    { 
      name: 'Lubricantes', 
      sub: [
        { display: 'Aceites 2 Tiempos', apiName: 'Aceites 2 Tiempos' },
        { display: 'Aceites 4 Tiempos', apiName: 'Aceites 4 Tiempos' },
        { display: 'Grasas', apiName: 'Grasas' }
      ]
    },
    { 
      name: 'Riego', 
      sub: [
        { display: 'Bombas de caudal', apiName: 'Bombas de caudal' },
        { display: 'Bombas de Presión', apiName: 'Bombas de presión' },
        { display: 'Accesorios', apiName: 'Accesorios bombas de caudal' }
      ]
    },
    { 
      name: 'Otros', 
      sub: [
        { display: 'Motores', apiName: 'Motores' },
        { display: 'Generadores', apiName: 'Generadores' },
        { display: 'Tijeras', apiName: 'Tijeras' }
      ]
    },
    { 
      name: 'Marcas', 
      sub: [
        { display: 'Annovi Reberberi', apiName: 'annovi-reverberi' },
        { display: 'Casamoto', apiName: 'casamoto' },
        { display: 'Ducati', apiName: 'ducati' },
        { display: 'Echo', apiName: 'echo' },
        { display: 'Husqvarna', apiName: 'husqvarna' },
        { display: 'Maruyama', apiName: 'maruyama' },
        { display: 'Stihl', apiName: 'stihl' },
        { display: 'Whale Best', apiName: 'whale-best' },
        { display: 'Shindaiwa', apiName: 'shindaiwa' },
        { display: 'Oleo-Mac', apiName: 'oleo-mac' }
      ],
      isBrands: true
    },
  ]

  const brandLogos: { [key: string]: string } = {
    'Husqvarna': '/images/brands/husqvarna.png',
    'Annovi Reberberi': '/images/brands/annovi-reberberi.png',
    'Casamoto': '/images/brands/casamoto.png',
    'Ducati': '/images/brands/ducati.png',
    'Whale Best': '/images/brands/whale-best.png',
    'Stihl': '/images/brands/stihl.png',
    'Maruyama': '/images/brands/Maruyama.png',
    'Oleo-Mac': '/images/brands/oleo-mac.png',
    'Echo': '/images/brands/echo.png',
    'Shindaiwa': '/images/brands/Shindaiwa.png',
  }

  // Calcular la posición top del navbar principal
  const getNavbarTop = () => {
    if (showTopBar) {
      return topBarHeight
    }
    return 0
  }

  // Calcular la posición top del panel de categorías (debajo del navbar)
  const getCategoriesPanelTop = () => {
    // h-24 en Tailwind = 6rem = 96px
    const navbarHeight = 96
    return getNavbarTop() + navbarHeight
  }

  return (
    <>
      {/* Barra superior */}
      <motion.div
        ref={topBarRef}
        initial={{ y: 0 }}
        animate={{ 
          y: showTopBar ? 0 : -topBarHeight,
          opacity: showTopBar ? 1 : 0
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`fixed top-0 left-0 w-full z-50 bg-white text-black transition-all duration-300 ${showTopBar ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="container mx-auto px-4 lg:px-8 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <FaMapMarker size={16} className='text-red-400 shrink-0' />
                <a href="https://maps.app.goo.gl/reR4bEpBNER3mwL1A">
                <span className="hidden sm:inline">Pichincha, Cayambe</span>
                <span className="sm:hidden text-xs sm:text-[0.7rem]">Cayambe</span>
                </a>
              </span>
              
              <span className="sm:inline-block md:inline-block h-4 w-px bg-gray-300"></span>
              
              <a 
                href="tel:(02) 2110537" 
                className="flex items-center gap-1 hover:text-blue-500 transition-colors whitespace-nowrap"
              >
                <FaPhone size={16} className='text-blue-500' />
                <span className='text-xs sm:text-[0.7rem]'>(02) 2110537</span>
              </a>
              
              <span className="sm:inline-block md:inline-block h-4 w-px bg-gray-300"></span>
              
              <a
                href="https://wa.me/593980582555?text=Hola%20quiero%20más%20información"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-green-500 transition-colors whitespace-nowrap"
              >
                <FaWhatsapp size={16} className='text-green-500' />
                <span className="sm:inline text-xs sm:text-[0.7rem]">0980582555</span>
              </a>
              
              <span className="hidden md:inline-block lg:inline-block h-4 w-px bg-gray-300"></span>
                
              <span className="hidden md:flex lg:flex items-center gap-1 whitespace-nowrap">
                <FaClock size={16} className='text-black shrink-0' />
                <span>Lun-Vie: 8:00 - 17:30</span>
              </span>
            </div>
            
            <div className={`hidden md:flex items-center gap-3 transition-opacity duration-300 ${showTopBar ? 'opacity-100' : 'opacity-0'}`}>
              <a 
                href="https://www.facebook.com/campomaqoficial/?locale=es_LA" 
                target="_blank" 
                className="hover:text-blue-500 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <a 
                href="https://www.instagram.com/campomaq/" 
                target="_blank" 
                className="hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a 
                href="https://www.youtube.com/@campomaq9918" 
                target="_blank" 
                className="hover:text-red-500 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={16} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navbar principal */}
      <header
        className={`fixed left-0 w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg' : 'bg-black'
        }`}
        style={{ 
          top: `${getNavbarTop()}px`,
          transitionProperty: 'top, background-color, box-shadow'
        }}
      >
        {/* DESKTOP ≥ 825px */}
        <nav className="hidden min-[825px]:flex max-w-7xl mx-auto px-4 lg:px-8 h-24 items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative w-[180px] h-[80px]">
              <Image
                src="/cmaq.png"
                alt="Campomaq Logo"
                fill
                sizes='(max-width: 1024px) 150px, 180px'
                style={{ objectFit: 'contain' }}
                priority={true}
              />
            </div>
          </Link>

          <ul
            className={`flex text-l font-semibold transition-all duration-200 ${
              scrolled ? 'text-black' : 'text-campomaq'
            }`}
            style={{ gap: 'clamp(8px, 2vw, 30px)' }}
          >
            <li 
              onMouseEnter={() => setShowCategories(false)}
              className="hover:text-campomaq font-bold transition-colors"
            >
              <Link href="/nosotros">Nosotros</Link>
            </li>
            <li 
              className="relative" 
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <Link 
                href="/productos"
                className="flex items-center gap-1 hover:text-campomaq transition-colors relative"
              >
                Productos
                <motion.div
                  animate={{ rotate: showCategories ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-current ml-1"
                />
              </Link>

              {/* Panel mejorado de categorías */}
              <AnimatePresence>
                {showCategories && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="fixed left-1/2 -translate-x-1/2 bg-white text-black rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[80vh]"
                      style={{ 
                        width: 'min(95vw, 900px)',
                        top: `${getCategoriesPanelTop()}px`
                      }}
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                    >
                      
                      <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-100">
                        <div className="p-4">
                          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {categories.map((cat, index) => (
                              <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03, duration: 0.2 }}
                                onMouseEnter={() => setHoveredCategory(cat.name)}
                                onMouseLeave={() => setHoveredCategory(null)}
                                className={`group relative p-3 rounded-lg border transition-all duration-300 hover:shadow-md ${
                                  hoveredCategory === cat.name 
                                    ? 'border-black bg-white transform -translate-y-1' 
                                    : 'border-black/10 hover:border-black'
                                }`}
                              >
                                <div className="mb-3">
                                  <h3 className={`font-bold text-sm transition-colors ${
                                    hoveredCategory === cat.name ? 'text-black' : 'text-gray-800'
                                  }`}>
                                    {cat.name}
                                  </h3>
                                  <div className={`h-0.5 w-0 transition-all duration-800 bg-campomaq ${
                                    hoveredCategory === cat.name ? 'w-full' : ''
                                  }`} />
                                </div>

                                <ul className="space-y-1">
                                  {cat.sub.map((subcat, subIndex) => (
                                    <motion.li
                                      key={subcat.display}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: (index * 0.03) + (subIndex * 0.01) }}
                                    >
                                      <Link
                                        href={
                                          cat.isBrands 
                                            ? `/productos?brand=${subcat.apiName}`
                                            : `/productos?category=${encodeURIComponent(subcat.apiName.toLowerCase())}`
                                        }
                                        className={`flex items-center justify-between group/item py-1.5 px-2 rounded text-xs transition-all duration-200 ${
                                          cat.isBrands
                                            ? 'hover:bg-gradient-to-r hover:from-campomaq/50 hover:to-yellow-50'
                                            : 'hover:bg-campomaq/50'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          {cat.isBrands && brandLogos[subcat.display] ? (
                                            <div className="w-5 h-5 relative flex-shrink-0">
                                              <Image
                                                src={brandLogos[subcat.display]}
                                                alt={`${subcat.display} logo`}
                                                fill
                                                sizes="24px"
                                                className="object-contain"
                                              />
                                            </div>
                                          ) : (
                                            <div className="w-1.5 h-1.5 bg-black rounded-full opacity-60 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                                          )}
                                          <span className={`font-medium transition-colors truncate ${
                                            hoveredCategory === cat.name 
                                              ? 'text-gray-700' 
                                              : 'text-gray-600 group-hover/item:text-gray-800'
                                          }`}>
                                            {subcat.display}
                                          </span>
                                        </div>
                                        <ChevronRight className="w-3 h-3 text-gray-400 opacity-0 group-hover/item:opacity-100 transform translate-x-1 group-hover/item:translate-x-0 transition-all duration-200 flex-shrink-0" />
                                      </Link>
                                    </motion.li>
                                  ))}
                                </ul>

                                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none rounded-lg ${
                                  hoveredCategory === cat.name ? 'animate-pulse' : ''
                                }`} style={{
                                  background: hoveredCategory === cat.name 
                                    ? 'linear-gradient(45deg, transparent, rgba(255,255,0,0.1), transparent)' 
                                    : undefined
                                }} />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600 text-xs">
                            ¿No encuentras lo que buscas?
                          </p>
                          <Link
                            href="/productos"
                            className="bg-campomaq hover:bg-campomaq/50 text-black px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                          >
                            Ver todos los productos
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </li>
            <li 
              onMouseEnter={() => setShowCategories(false)}
              className="hover:text-campomaq transition-colors"
            >
              <Link href="/servicios">Servicios</Link>
            </li>
          </ul>

          <div className="flex items-center gap-3 shrink-0 text-sm">
            <Link
              href="https://wa.me/593980582555?text=Hola%20quiero%20más%20información"
              target="_blank"
              className={`font-semibold px-4 py-2 transition-colors ${
                scrolled
                  ? 'bg-green-500 text-black hover:bg-green-400 hover:text-white'
                  : 'bg-green-400 text-white hover:bg-green-500 hover:text-black'
              }`}
            >
              Contacto <FaWhatsapp className="inline-block ml-1" />
            </Link>

            {!isProductsPage && (
              <div className={`flex items-center rounded px-2 py-1 w-[clamp(160px,20vw,240px)] ${
                scrolled
                  ? 'bg-gray-300 text-black hover:text-white'
                  : 'bg-white text-white hover:text-black'
              }`}>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="outline-none text-black w-full text-sm"
                />
                <button onClick={handleSearch} className='cursor-pointer'>
                  <Search className="text-gray-500 w-5 h-5 shrink-0" />
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* TABLET 640px – 824px */}
        <div className="hidden min-[640px]:max-[824px]:flex flex-col px-4 py-3 shadow-md"
          style={{ backgroundColor: scrolled ? '#fff' : '#000' }}
        >
          <div className="flex items-center justify-between gap-2 h-16">
            <Link href="/" className="relative  w-[150px] h-[50px] shrink-0">
              <Image
                src="/cmaq.png"
                alt="Campomaq Logo"
                fill
                sizes='(max-width: 640px) 120px, (max-width: 824px) 120px, 140px'
                style={{ objectFit: 'contain' }}
              />
            </Link>

            {!isProductsPage && (
              <div className="flex items-center bg-white rounded px-2 py-1 w-[clamp(140px,50%,220px)]">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="outline-none text-black w-full text-sm"
                />
                <button onClick={handleSearch} className='cursor-pointer'>
                  <Search className="text-gray-500 w-4 h-4 shrink-0" />
                </button>
              </div>
            )}

            <button onClick={() => setOpen(!open)} className={scrolled ? "text-black" : "text-yellow-400"}>
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
                  className={`px-4 py-2 rounded hover:opacity-80 ${
                    scrolled
                      ? 'bg-green-500 text-black hover:bg-green-400 hover:text-white'
                      : 'bg-green-400 text-white hover:bg-green-500 hover:text-black'
                  }`}
                >
                  Contacto <FaWhatsapp className={`inline-block ml-1 `} />
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
            <Link href="/" className="relative  w-[150px] h-[50px] min-w-[120px] shrink-0">
              <Image
                src="/cmaq.png"
                alt="Campomaq Logo"
                fill
                sizes='(max-width: 640px) 120px, (max-width: 824px) 140px, 120px'
                style={{ objectFit: 'contain' }}
              />
            </Link>

            {!isProductsPage && (
              <div className="flex items-center bg-white rounded px-2 py-1 w-[clamp(140px,60%,220px)]">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="outline-none text-black w-full text-sm"
                />
                <button onClick={handleSearch} className='cursor-pointer'>
                  <Search className="text-gray-500 w-4 h-4 shrink-0" />
                </button>
              </div>
            )}

            <button onClick={() => setOpen(!open)} className={scrolled ? "text-black" : "text-yellow-400"}>
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
                  scrolled ? 'bg-white text-black' : 'bg-black text-yellow-400'
                }`}
              >
                <li><Link href="/nosotros">Nosotros</Link></li>
                <li><Link href="/productos">Productos</Link></li>
                <li><Link href="/servicios">Servicios</Link></li>
                <li>
                  <Link
                    href="https://wa.me/593980582555?text=Hola%20quiero%20más%20información"
                    target="_blank"
                    className={`px-4 py-2 ${
                    scrolled
                      ? 'bg-green-500 text-black hover:bg-green-400 hover:text-white'
                      : 'bg-green-400 text-white hover:bg-green-500 hover:text-black'
                  }`}
                  >
                    Contacto <FaWhatsapp className="inline-block ml-1" />
                  </Link>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Redes sociales flotantes */}
      <AnimatePresence>
        {showFloatingSocials && !isFooterVisible && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50}}
            transition={{ duration: 0.3 }}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-4"
          >
            <a 
              href="https://www.facebook.com/campomaqoficial/?locale=es_LA" 
              target="_blank" 
              className="p-3 bg-black text-blue-600 rounded-full hover:bg-campomaq transition-colors shadow-lg flex items-center justify-center"
              aria-label="Facebook"
            >
              <FaFacebookF size={18} />
            </a>
            <a 
              href="https://www.instagram.com/campomaq/" 
              target="_blank" 
              className="p-3 bg-black text-pink-500 rounded-full hover:bg-campomaq transition-colors shadow-lg flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram size={18} />
            </a>
            <a 
              href="https://www.youtube.com/@campomaq9918" 
              target="_blank" 
              className="p-3 bg-black text-red-500 rounded-full hover:bg-campomaq transition-colors shadow-lg flex items-center justify-center"
              aria-label="YouTube"
            >
              <FaYoutube size={18} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}