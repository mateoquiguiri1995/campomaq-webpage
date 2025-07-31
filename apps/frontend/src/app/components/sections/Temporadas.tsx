'use client'
import Image from 'next/image'
import { Button } from '../ui/Button'

const seasons = [
  {
    name: 'Invierno',
    description: 'Equipos especializados para las condiciones invernales',
    image: '/images/seasons/im4.jpg'
  },
  {
    name: 'Verano',
    description: 'Maquinaria para el mantenimiento estival',
    image: '/images/seasons/im3.jpg'
  },
  {
    name: 'Cosecha',
    description: 'Soluciones eficientes para época de cosecha',
    image: '/images/seasons/im2.jpg'
  },
  {
    name: 'Siembra',
    description: 'Tecnología de precisión para siembra',
    image: '/images/seasons/im1.jpg'
  }
]

export default function Temporadas() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Maquinaria por Temporada
        </h2>
        
        <div className="flex overflow-x-auto hide-scrollbar pb-8 -mx-4 px-4">
          <div className="flex space-x-6">
            {seasons.map((season, index) => (
              <div key={index} className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={season.image}
                    alt={season.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{season.name}</h3>
                  <p className="text-gray-600 mb-4">{season.description}</p>
                  <Button variant="primary">Ver Productos</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}