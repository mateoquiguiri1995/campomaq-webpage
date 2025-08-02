"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: number;
  name: string;
  brand: string;
  brandLogo: string;
  normalPrice: number;
  offerPrice: number;
  images: string[];
  offerEndsAt: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Motocultor Agrícola",
    brand: "STIHL",
    brandLogo: "/images/brands/STIHL.jpg",
    normalPrice: 1500,
    offerPrice: 1299,
    images: [
      "/images/prodOffer/motocultor1.webp",
      "/images/prodOffer/motocultor2.jpg",
      "/images/prodOffer/motocultor3.jpeg",
    ],
    offerEndsAt: "2025-08-04T23:59:59",
  },
  {
    id: 2,
    name: "Motoguadaña Pro",
    brand: "STIHL",
    brandLogo: "/images/brands/STIHL.jpg",
    normalPrice: 450,
    offerPrice: 379,
    images: [
      "/images/prodOffer/motoguadana1.jpeg",
      "/images/prodOffer/motoguadana2.jpeg",
    ],
    offerEndsAt: "2025-08-04T23:59:59",
  },
];

export default function WeeklyOffer() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="my-8">
      <h2 className="font-bold text-xl text-gray-600 mb-4">Oferta del Mes</h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Tarjeta de la oferta seleccionada */}
        <div className="flex-1">
          <ProductCard product={products[selected]} />
        </div>

        {/* Botones de selección */}
        <div className="flex md:flex-col gap-2 justify-center">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selected === idx
                  ? "bg-campomaq text-black"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
               {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  // Cambio automático de imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [product.images.length]);

  // Contador regresivo
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(product.offerEndsAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Finalizado");
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [product.offerEndsAt]);

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Imagen con slider */}
      <div className="relative w-full md:w-1/2 h-[250px] md:h-[300px]">
        <AnimatePresence >
          <motion.img
            key={currentImage}
            src={product.images[currentImage]}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>

        {/* Radio buttons */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-3 h-3 rounded-full border-2 border-white transition ${
                currentImage === idx ? "bg-white" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col justify-between w-full md:w-1/2">
        {/* Marca */}
        <div className="flex items-center gap-2 mb-1">
          <img
            src={product.brandLogo}
            alt={product.brand}
            className="w-8 h-8 object-contain border border-gray-200 rounded bg-white p-1"
          />
          <p className="text-sm text-gray-600">{product.brand}</p>
        </div>

        <h3 className="text-lg text-black font-semibold">{product.name}</h3>

        <span className="w-32 text-sm text-white font-semibold bg-red-500 px-2 py-1 rounded mt-1">
          Stock limitado
        </span>
        <p className="text-gray-700 text-sm mt-1">
          Motocultor apto para cualquier terreno, ideal para florícolas.
        </p>

        <div className="mt-2">
          <span className="text-gray-400 line-through mr-2">
            ${product.normalPrice}
          </span>
          <span className="text-2xl font-bold text-black">
            ${product.offerPrice}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          Oferta termina en:{" "}
          <span className="font-semibold">{timeLeft}</span>
        </p>

        <button className="mt-4 bg-campomaq text-black hover:bg-black hover:text-campomaq font-semibold py-2 px-4 rounded-lg transition hover:cursor-pointer">
          Comprar
        </button>
      </div>
    </div>
  );
}
