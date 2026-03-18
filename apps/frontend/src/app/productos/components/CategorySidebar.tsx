"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tractor,
  Trees,
  Droplets,
  SprayCan,
  Wrench,
  ChevronDown,
  Tag,
  Building2
} from "lucide-react";

interface Category {
  name: string;
  icon: React.ReactNode;
  sub: { display: string; apiName: string }[];
}

interface Brand {
  name: string;
  logo: string;
  slug: string;
}

interface CategorySidebarProps {
  variant?: "desktop" | "mobile";
}

export default function CategorySidebar({ variant = "desktop" }: CategorySidebarProps) {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeBrands, setActiveBrands] = useState<boolean>(true);

  const categories: Category[] = [
    { 
      name: "Motocultores", 
      icon: <Tractor size={18} />, 
      sub: [
        { display: "Motocultores", apiName: "Motocultores" },
        { display: "Mini Tractores Cortacésped", apiName: "Mini Tractores Cortacésped" },
        { display: "Motoazadas", apiName: "Motoazadas" },
        { display: "Accesorios", apiName: "Accesorios Motocultores" }
      ]
    },
    { 
      name: "Bosque y Jardín", 
      icon: <Trees size={18} />, 
      sub: [
        { display: "Cortacésped", apiName: "Cortacésped" },
        { display: "Cortacetos", apiName: "Cortacetos" },
        { display: "Desbrozadoras", apiName: "Desbrozadoras" },
        { display: "Motosierras", apiName: "Motosierras" },
        { display: "Sopladoras", apiName: "Sopladoras" },
        { display: "Accesorios", apiName: "Accesorios Desbrozadoras y Motosierras" }
      ]
    },
    { 
      name: "Fumigación", 
      icon: <SprayCan size={18} />, 
      sub: [
        { display: "Discos fumigación", apiName: "Discos fumigación" },
        { display: "Fumigadoras motorizadas", apiName: "Fumigadoras motorizadas" },
        { display: "Fumigadoras manuales", apiName: "Fumigadoras manuales" },
        { display: "Espolvoreadores", apiName: "Espolvoreadores" },
        { display: "Accesorios", apiName: "Accesorios Bombas de fumigar" }
      ]
    },
    { 
      name: "Lubricantes", 
      icon: <Droplets size={18} />, 
      sub: [
        { display: "Aceites 2 Tiempos", apiName: "Aceites 2 Tiempos" },
        { display: "Aceites 4 Tiempos", apiName: "Aceites 4 Tiempos" },
        { display: "Grasas", apiName: "Grasas" }
      ]
    },
    { 
      name: "Riego", 
      icon: <Droplets size={18} />, 
      sub: [
        { display: "Bombas de caudal", apiName: "Bombas de caudal" },
        { display: "Bombas de presión", apiName: "Bombas de presión" },
        { display: "Accesorios", apiName: "Accesorios bombas de caudal" }
      ]
    },
    { 
      name: "Otros", 
      icon: <Wrench size={18} />, 
      sub: [
        { display: "Motores", apiName: "Motores" },
        { display: "Generadores", apiName: "Generadores" },
        { display: "Tijeras", apiName: "Tijeras" }
      ]
    },
  ];

  const brands: Brand[] = [
    { name: "Annovi Reverberi", logo: "/images/brands/annovi-reberberi.png", slug: "annovi-reverberi" },
    { name: "Casamoto", logo: "/images/brands/casamoto.png", slug: "casamoto" },
    { name: "Ducati", logo: "/images/brands/ducati.png", slug: "ducati" },
    { name: "Echo", logo: "/images/brands/echo.png", slug: "echo" },
    { name: "Husqvarna", logo: "/images/brands/husqvarna.png", slug: "husqvarna" },
    { name: "Maruyama", logo: "/images/brands/Maruyama.png", slug: "Maruyama" },
    { name: "Stihl", logo: "/images/brands/stihl.png", slug: "stihl" },
    { name: "Whale Best", logo: "/images/brands/whale-best.png", slug: "whale-best" },
    { name: "Shindaiwa", logo: "/images/brands/shindaiwa.png", slug: "shindaiwa" },
    { name: "Oleo-Mac", logo: "/images/brands/oleo-mac.png", slug: "oleo-mac" },
  ];

  const toggleCategory = (categoryName: string) => {
    setActiveCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleBrands = () => {
    setActiveBrands(!activeBrands);
  };

  const generateBrandColors = (brand: string) => {
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 
      'bg-orange-600', 'bg-teal-600', 'bg-indigo-600', 'bg-pink-600',
      'bg-cyan-600', 'bg-amber-600'
    ];
    let hash = 0;
    for (let i = 0; i < brand.length; i++) {
      hash = brand.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <nav className={`bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col ${variant === "mobile" ? "min-h-0" : "h-full max-h-screen min-h-0"}`}>
      {/* Contenido scrolleable */}
      <div className={`flex-1 min-h-0 ${variant === "mobile" ? "" : "overflow-y-auto"} scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2`}>
        {/* Categories Section */}
        <div className="p-6 pr-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-600">Categorías</h3>
          </div>
          
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.name}>
                <motion.div
                  className="group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group-hover:shadow-md cursor-pointer"
                    onClick={() => toggleCategory(cat.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-gray-100 text-gray-600 group-hover:bg-campomaq/80 group-hover:text-black transition-colors cursor-pointer">
                        {cat.icon}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{cat.name}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: activeCategories.includes(cat.name) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {activeCategories.includes(cat.name) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <ul className="ml-10 mt-2 space-y-1 pb-2">
                          {cat.sub.map((sub, index) => (
                            <motion.li
                              key={sub.display}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={`/productos?category=${encodeURIComponent(sub.apiName.toLowerCase())}`}
                                className="block px-4 py-2 text-sm text-gray-600 hover:text-black hover:font-bold hover:bg-blue-50 rounded-md transition-all duration-150 hover:translate-x-1"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                  {sub.display}
                                </span>
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>

        {/* Brands Section */}
        <div className="p-6 pr-4">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-600">Marcas</h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
              onClick={toggleBrands}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors">
                  <Tag size={18} />
                </div>
                <span className="font-medium text-gray-900 text-sm">Todas las marcas</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {brands.length}
                </span>
              </div>
              <motion.div
                animate={{ rotate: activeBrands ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {activeBrands && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <ul className="ml-10 mt-3 space-y-2 pb-2">
                    {brands.map((brand, index) => (
                      <motion.li
                        key={brand.slug}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link
                          href={`/productos?brand=${brand.slug}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-150 group hover:translate-x-1"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
                            {brand.logo.startsWith('/') || brand.logo.startsWith('http') ? (
                              <img
                                src={brand.logo}
                                alt={`${brand.name} logo`}
                                className="w-full h-full object-contain rounded-lg"
                                onError={(e) => {
                                  // Fallback si la imagen no carga
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : (
                              <div className={`w-full h-full ${generateBrandColors(brand.name)} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                                {brand.logo}
                              </div>
                            )}
                            {/* Fallback hidden by default */}
                            <div
                              className={`w-full h-full ${generateBrandColors(brand.name)} rounded-lg items-center justify-center text-white text-xs font-bold`}
                              style={{ display: 'none' }}
                            >
                              {brand.name.charAt(0)}{brand.name.split(' ')[1]?.charAt(0) || ''}
                            </div>
                          </div>
                          <span className="font-medium group-hover:font-semibold transition-all">
                            {brand.name}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Spacer para garantizar scroll siempre visible */}
        <div className="h-4"></div>
      </div>

      {/* Footer fijo (oculto en móvil para evitar scroll anidado) */}
      {variant !== "mobile" && (
        <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Explora nuestro catálogo completo
          </p>
        </div>
      )}
    </nav>
  );
}