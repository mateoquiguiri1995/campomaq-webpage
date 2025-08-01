'use client'
import Image from 'next/image'
import { Eye } from 'lucide-react'

const products = [
  { name: 'MOTOCULTORES', description: 'maquinas increibles adaptables al terreno', image: '/images/prod-home/motocultor.jpg' },
  { name: 'MOTOAZADAS', description: 'maquinas de diferentes marcas', image: '/images/prod-home/motoazada.png' },
  { name: 'DESBROZADORAS', description: 'Perfectas para la epoca de lluvias', image: '/images/prod-home/desbrozadora.png' },
  { name: 'MINI TRACKTOR', description: 'Vehiculo adaptable a cualquier terreno', image: '/images/prod-home/minitracktor.webp' },
  { name: 'PODADORAS', description: 'excelentes para arbustos bajos y altos', image: '/images/prod-home/podadoras.jpg' },
  { name: 'MOTOSIERRA', description: 'Diferentes marcas que garantizan un corte suave y limpio', image: '/images/prod-home/motosierra.jpg' },
  { name: 'SOPLADORAS', description: 'Ideales para la limpieza de hojas y basura', image: '/images/prod-home/sopladoras.webp' },
  { name: 'BOMBAS DE FUMIGAR', description: 'Ideales para evitar plagas', image: '/images/prod-home/bombas.jpg' },
  { name: 'ACEITES', description: 'Disponibles para cualquier maquinaria', image: '/images/prod-home/aceites.jpg' },
  { name: 'CUCHILLAS', description: 'Disponibles para cualquier maquina o herramienta', image: '/images/prod-home/cuchillas.webp' },
  { name: 'ALAMBRES', description: 'Solidos y perfectos para la seguridad', image: '/images/prod-home/alambres.webp' },
  { name: 'OTROS', description: 'Tijeras, Machetes, Azadones, etc', image: '/images/prod-home/otros.jpeg' },
]

export default function Productos() {
  return (
    <section 
      className="py-16 px-4 sm:px-6 lg:px-8 relative bg-gray-900 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/bg/bg-home-prod.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Nuestros Productos
        </h2>

        {/* Grid adaptable */}
        <div className="
          grid 
          gap-8 
          justify-center
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          xl:grid-cols-5
        ">
          {products.map((product, index) => (
            <div 
              key={index} 
              className="group relative bg-white shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Imagen */}
              <div className="relative w-full h-56 md:h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {/* Overlay solo en desktop */}
                <div className="
                  hidden md:flex
                  absolute inset-0 
                  bg-yellow-400/40
                  flex-col items-center justify-center 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300
                  text-center p-4
                ">
                  <h3 className="text-lg font-semibold text-black mb-2">{product.name}</h3>
                  <p className="text-sm text-black mb-4">{product.description}</p>
                  <button className="bg-black text-yellow-400 px-4 py-2  font-semibold hover:bg-white cursor-pointer transition-colors">
                    Ver más
                  </button>
                </div>
              </div>

              {/* Vista móvil */}
              <div className="flex md:hidden items-center justify-between p-3 bg-black border-t border-yellow-500">
                <span className="font-semibold text-white">{product.name}</span>
                <button className="p-2 rounded-full bg-yellow-500 text-white hover:bg-white transition-colors cursor-pointer">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
