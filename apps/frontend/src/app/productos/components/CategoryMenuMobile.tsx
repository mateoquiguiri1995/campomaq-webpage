"use client";
import { useState } from "react";
import { X } from "lucide-react";
import CategorySidebar from "./CategorySidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Blocks } from "lucide-react";
export default function CategoryMenuMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden"> {/* Oculto en escritorio */}
      {/* Botón de apertura */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white text-gray-400 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <span className="font-medium"><Blocks /></span>
      </button>

      {/* Menú lateral */}
      <AnimatePresence>
        {open && (
          <>
            {/* Fondo semitransparente */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />

            {/* Panel lateral */}
            <motion.div
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white shadow-lg z-50 flex flex-col"
            >
              {/* Encabezado */}
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h2 className="font-bold text-lg text-gray-800">Categorías</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Contenido */}
              <div className="flex-1 overflow-y-auto p-4">
                <CategorySidebar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
