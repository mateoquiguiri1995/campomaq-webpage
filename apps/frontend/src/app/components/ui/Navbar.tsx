'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full bg-black shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-around items-center h-20">
        <div className="flex items-center gap-3">
          <div className="relative w-[160px] h-[130px]">
            <Image 
              src="/campomaq.png" 
              alt="Campomaq Logo" 
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        {/* Resto del código permanece igual */}
        <ul className="hidden md:flex gap-10 text-xxl font-semibold text-yellow-700">
          <li><Link href="/">Inicio</Link></li>
          <li><Link href="/productos">Productos</Link></li>
          <li><Link href="/servicios">Servicios</Link></li>
          <li><Link href="/nosotros">Nosotros</Link></li>
          <li><Link href="/contacto">Contacto</Link></li>
        </ul>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6 text-yellow-700" /> : <Menu className="w-6 h-6 text-yellow-700" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-black shadow-md px-6 pb-4">
          <ul className="flex flex-col gap-4 text-sm font-semibold text-yellow-700">
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/productos">Productos</Link></li>
            <li><Link href="/servicios">Servicios</Link></li>
            <li><Link href="/nosotros">Nosotros</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
          </ul>
        </div>
      )}
    </header>
  )
}