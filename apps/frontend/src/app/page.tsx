// src/app/page.tsx
'use client';
import Chatbot from './components/Chatbot';
export default function Home() {
  return (
    
    <main className="relative h-screen w-full overflow-hidden bg-black text-yellow-400 flex items-center justify-center font-orbitron">
      {/* Animated Background Waves */}
      <div className="absolute -top-1/2 left-0 w-full h-full bg-yellow-500 opacity-10 animate-wave1 rounded-full blur-3xl" />
      <div className="absolute -bottom-1/2 right-0 w-full h-full bg-yellow-400 opacity-10 animate-wave2 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/3 w-2/3 h-2/3 bg-yellow-300 opacity-10 animate-wave3 rounded-full blur-2xl" />
      <div className="h-screen bg-gradient-to-r from-yellow-400 to-black bg-[length:200%_200%] animate-gradient-x" />


      {/* Foreground Content */}
      <div className="h-screen w-full flex flex-col items-center justify-center text-center text-yellow-400 animate-fondoGradual transition-colors duration-1000">
        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg" style={{ textShadow: '2px 2px 4px #000000'}}>
          Campo Maq
        </h1>
        <p className="mt-6 text-xl text-white/80">Muy Pronto</p>
      </div>

      {/* Aquí se inyecta el chatbot */}
      <Chatbot />
    </main>
  );
}
