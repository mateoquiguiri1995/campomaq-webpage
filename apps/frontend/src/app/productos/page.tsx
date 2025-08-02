import SearchBar from "./components/SearchBar";
import CategorySidebar from "./components/CategorySidebar";
import CategoryMenuMobile from "./components/CategoryMenuMobile";
import WeeklyOffer from "./components/WeeklyOffer";
import PopularProducts from "./components/PopularProducts";
import TrendingProducts from "./components/TrendingProducts";

export default function ProductosPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-28">
      {/* Sidebar en desktop */}
      <aside className="hidden md:block w-64 bg-white border-r">
        <CategorySidebar />
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col p-4">
        {/* SearchBar + Slider fijos */}
        <div className="sticky top-28 bg-white z-20 pb-2">
          {/* Menú lateral + barra de búsqueda en móviles */}
          <div className="md:hidden flex items-center gap-2 mb-4">
            <CategoryMenuMobile />
            <div className="flex-1">
              <SearchBar />
            </div>
          </div>

          {/* Barra de búsqueda en desktop */}
          <div className="hidden md:block mb-4">
            <SearchBar />
          </div>

        

          {/* Slider fijo */}
          
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto mt-4">
          <WeeklyOffer />
          <PopularProducts />
          <TrendingProducts />
        </div>
      </div>
    </div>
  );
}
