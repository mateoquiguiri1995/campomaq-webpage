'use client'
import { Button } from '../ui/Button';

export default function HeroVideo() {
  return (
    <section className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 object-cover w-full h-full z-[-1]"
        poster="/fallback.jpg"
      >
        <source src="/videos/v1.mp4" type="video/mp4" />
      </video>

      {/* Oscurecer video para mejor contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
      <div className="relative z-10 pt-24 pl-8 pr-8 md:pl-40 md:pt-60 max-w-4xl text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-xl">
          CAMPOMAQ
        </h1>
        <p className="text-base md:text-xl mb-6 drop-shadow-md">
          Distribuidores líderes de maquinaria agrícola y de jardinería
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary">Más Información</Button>
          <Button variant="outline">Ver Productos Destacados</Button>
        </div>
      </div>
    </section>
  )
}
