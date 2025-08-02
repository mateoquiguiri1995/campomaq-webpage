"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tractor,
  Trees,
  Droplets,
  SprayCan,
  Wrench,
  Hammer,
  Tags
} from "lucide-react";


export default function CategorySidebar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { name: "Agrícola", icon: <Tractor size={18} />, sub: ["Motocultores", "Tractores", "Motoguadañas"] },
    { name: "Forestal", icon: <Trees size={18} />, sub: ["Motosierras", "Desbrozadoras"] },
    { name: "Riego", icon: <Droplets size={18} />, sub: ["Bombas de agua", "Aspersores"] },
    { name: "Fumigación", icon: <SprayCan size={18} />, sub: ["Pulverizadores", "Nebulizadores"] },
    { name: "Repuestos", icon: <Wrench size={18} />, sub: ["Filtros", "Cuchillas", "Bujías"] },
    { name: "Accesorios", icon: <Hammer size={18} />, sub: ["Herramientas", "Equipos de protección"] },
    { name: "Marcas", icon: <Tags size={18} />, sub: ["echo", "Stihl", "Husqvarna", "Kawasaki", "Echo", "shindaiwa", "maruyama"] },
  ];

  const toggleCategory = (categoryName: string) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  return (
    <nav className="p-4 bg-white rounded-lg shadow-md border border-gray-200 min-h-screen flex flex-col">
      <h2 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Categorías</h2>
      <ul className="flex-1 space-y-1 overflow-y-auto pr-1">
        {categories.map((cat) => (
          <li key={cat.name} className="border-b border-gray-100 last:border-b-0">
            <div
              className="flex justify-between items-center py-2 px-2 cursor-pointer hover:bg-yellow-500 rounded-md transition-colors"
              onClick={() => toggleCategory(cat.name)}
            >
              <div className="flex items-center gap-2 text-black font-medium">
                {cat.icon}
                {cat.name}
              </div>
              <span className="text-black text-lg font-bold">
                {activeCategory === cat.name ? "−" : "+"}
              </span>
            </div>

            <AnimatePresence initial={false}>
              {activeCategory === cat.name && cat.sub && (
                <motion.ul
                  key="submenu"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="ml-6 mt-1 mb-2 space-y-1.5 overflow-hidden"
                >
                  {cat.sub.map((sub) => (
                    <li key={sub}>
                      <Link
                        href={`/productos?categoria=${sub.toLowerCase()}`}
                        className="block py-1.5 px-2 text-sm text-black hover:text-black hover:bg-yellow-200 rounded transition-colors hover:pl-5"
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </nav>
  );
}
