'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const brands = [
  { name: 'Husqvarna', logo: '/images/brands/husqvarna.svg', width: 100, height: 100 },
  { name: 'Maruyama', logo: '/images/brands/Maruyama.png', width: 100, height: 100 },
  { name: 'Subaru', logo: '/images/brands/subaru.jpeg' },
  { name: 'Kawasaki', logo: '/images/brands/kawasaki.png' },
  { name: 'Oleo-Mac', logo: '/images/brands/oleomac.jpg' },
  { name: 'Stihl', logo: '/images/brands/STIHL.jpg' },
  { name: 'Echo', logo: '/images/brands/echo.svg' },
  { name: 'Shindaiwa', logo: '/images/brands/Shindaiwa.png' }
]

const features = [
  {
    title: <>¿Por qué comprar en <strong className="text-campomaq">campo</strong>maq?</>,
    content: "Más de 20 años de experiencia nos respaldan en la distribución de equipos de calidad para el campo y jardinería.",
    image: "/images/features/agricola.jpg"
  },
  {
    title: <>Soporte técnico <strong className="text-campomaq">especializado</strong></>,
    content: "Contamos con técnicos certificados por las principales marcas para brindarte el mejor servicio post-venta.",
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
    const speed = 0.4

    const animate = () => {
      position -= speed
      const firstChild = slider.children[0] as HTMLElement
      if (position <= -firstChild.clientWidth) {
        position += firstChild.clientWidth
        slider.appendChild(firstChild)
      }
      slider.style.transform = `translate3d(${position}px, 0, 0)`
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <section className="py-1 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* 🔹 Slider */}
        <div className="relative overflow-hidden py-8">
          <div
            ref={sliderRef}
            className="flex w-max items-center select-none"
            style={{ willChange: 'transform' }}
          >
            {[...brands, ...brands].map((brand, index) => (
              <div key={`${brand.name}-${index}`} className="mx-8 flex-shrink-0">
                <div
                  className="relative opacity-80 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    width: brand.width ? `${brand.width / 10}rem` : '7rem',
                    height: brand.height ? `${brand.height / 10}rem` : '4rem'
                  }}
                >
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

          {/* Fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
        </div>

        {/* 🔹 Secciones */}
        {features.map((feature, index) => (
          <div
            key={index}
            className="mb-16 md:mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            {/* Texto */}
            <div
              className={`space-y-6 ${
                index % 2 === 0 ? 'md:order-1 md:pr-8' : 'md:order-2 md:pl-8'
              }`}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-lg text-gray-600">{feature.content}</p>
            </div>

            {/* Imagen */}
            <div
              className={`relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg ${
                index % 2 === 0 ? 'md:order-2' : 'md:order-1'
              }`}
            >
              <Image
                src={feature.image}
                alt={typeof feature.title === 'string' ? feature.title : ''}
                fill
                style={{ objectFit: 'cover' }}
                className="hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
