import HeroVideo from "@/app/components/sections/HeroVideo";
import Marcas from "@/app/components/sections/Marcas";
import ProductosHome from "@/app/components/sections/Prod-Home";
import Ubicacion from "@/app/components/sections/Ubicacion";

export default function HomePage() {
  return (
    <>
      <HeroVideo />
      <Marcas />
      <ProductosHome />
      <Ubicacion />
    </>
  );
}
