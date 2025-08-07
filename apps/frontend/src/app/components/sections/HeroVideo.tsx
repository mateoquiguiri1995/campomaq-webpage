'use client';
import { Button } from '../ui/Button';

export default function HeroVideo() {
  return (
    <section className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-black z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 object-cover w-full h-full z-[1]"
        poster="/fallback.jpg"
      >
        <source src="/videos/v1.mp4" type="video/mp4" />
      </video>

      {/* Oscurecer video para mejor contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 pt-24 pl-8 pr-9 md:pl-40 md:pt-60 max-w-4xl">
        {/* h1 fluido */}
        <h1
          className="
            font-bold mb-6 leading-tight drop-shadow-xl text-black
            text-[clamp(3rem,9vw,4.5rem)] pl-[clamp(0.5rem,3vw,1rem)] pr-[clamp(0.5rem,3vw,1rem)] pt-[clamp(4rem,3vw,1rem)] 
          "
        >
          CAMPOMAQ    {/* [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFD700,_0_0_15px_#FFD700] */}
        </h1>

        {/* párrafo fluido */}
        <p
          className="
            mb-6 drop-shadow-md text-white
            text-[clamp(1rem,3vw,2rem)]
          "
        >
          Distribuidores líderes de maquinaria agrícola y de jardinería
        </p>

        {/* botones fluidos */}
        <div className="flex flex-col min-[515px]:flex-row gap-4">
          <Button
            variant="primary"
            className="
              text-[clamp(0.8rem,2vw,1.2rem)]
              px-[clamp(0.75rem,2vw,1.5rem)]
              py-[clamp(0.5rem,1.2vw,0.75rem)]
            "
          >
            Más Información
          </Button>
          <Button
            variant="outline"
            className="
              text-[clamp(0.8rem,2vw,1.2rem)]
              px-[clamp(0.75rem,2vw,1.5rem)]
              py-[clamp(0.5rem,1.2vw,0.75rem)]
            "
          >
            Ver Productos Destacados
          </Button>
        </div>
      </div>
    </section>
  );
}
