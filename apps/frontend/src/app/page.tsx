'use client'
import Chatbot from './components/Chatbot';
import React from 'react';
import Navbar from './components/ui/Navbar';
import HeroVideo from './components/sections/HeroVideo';
import Marcas from './components/sections/Marcas'
import Temporadas from './components/sections/Temporadas'
import Ubicacion from './components/sections/Ubicacion'
import Footer from './components/ui/Footer'

export default function Home() {
  return (
    <div className="bg-yellow text-black">
      <Navbar />
      <HeroVideo />
      <Marcas />
      <Temporadas />
      <Ubicacion />
      <Footer />
      <Chatbot />
    </div>
  );
}
