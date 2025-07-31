'use client'
import Image from 'next/image'
import { Button } from '../ui/Button'
import { useEffect, useRef } from 'react'

const brands = [
  { name: 'Husqvarna', logo: '/images/brands/husqvarna.svg' },
  { name: 'Maruyama', logo: '/images/brands/Maruyama.svg' },
  { name: 'Partner', logo: '/images/brands/partner.svg' },
  { name: 'Kawasaki', logo: '/images/brands/kawasaki.svg' },
  { name: 'Oleo-Mac', logo: '/images/brands/oleomac.svg' },
  { name: 'Stihl', logo: '/images/brands/stihl.svg' },
  { name: 'Echo', logo: '/images/brands/echo.svg' },
  { name: 'Shindaiwa', logo: '/images/brands/shindaiwa.svg' }
]

const features = [
  {
    title: "Expertos en maquinaria agrícola",
    content: "Más de 20 años de experiencia nos respaldan en la distribución de equipos de calidad para el campo y jardinería.",
    buttonText: "Conoce nuestra historia",
    image: "/images/features/agricola.jpg"
  },
  {
    title: "Soporte técnico especializado",
    content: "Contamos con técnicos certificados por las principales marcas para brindarte el mejor servicio post-venta.",
    buttonText: "Nuestros servicios",
    image: "/images/features/soporte.jpg"
  }
]

export default function Marcas() {
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    let animationId: number
    let position = 0
    const speed = 0.5 // px por frame (ajustar para velocidad deseada)

    const animate = () => {
      position -= speed
      
      // Cuando el primer elemento sale completamente de la vista
      if (position < -slider.children[0].clientWidth) {
        // Mover el primer elemento al final
        const firstChild = slider.children[0] as HTMLElement
        position += firstChild.clientWidth
        slider.appendChild(firstChild)
      }
      
      slider.style.transform = `translateX(${position}px)`
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Sección de características - 2 bloques alternados */}
        {features.map((feature, index) => (
          <div key={index} className={`mb-16 md:mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
            {/* Bloque de texto */}
            <div className={`space-y-6 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-lg text-gray-600">{feature.content}</p>
              <Button variant="primary">{feature.buttonText}</Button>
            </div>
            
            {/* Bloque de imagen */}
            <div className={`relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg ${index % 2 === 0 ? 'md:order-1' : 'md:order-0'}`}>
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                style={{ objectFit: 'cover' }}
                className="hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ))}

        {/* Título sección marcas */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Marcas que nos respaldan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Distribuimos las mejores marcas del mercado con garantía oficial
          </p>
        </div>

        {/* Slider de marcas automático */}
        <div className="relative overflow-hidden py-8">
          <div 
            ref={sliderRef}
            className="flex w-max items-center"
            style={{ willChange: 'transform' }}
          >
            {/* Duplicamos las marcas para efecto continuo */}
            {[...brands, ...brands].map((brand, index) => (
              <div key={`${brand.name}-${index}`} className="mx-8 flex-shrink-0">
                <div className="relative w-32 h-20 opacity-80 hover:opacity-100 transition-opacity duration-300">
                  <Image 
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Efecto de desvanecimiento en los bordes */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>
      </div>
    </section>
  )
}