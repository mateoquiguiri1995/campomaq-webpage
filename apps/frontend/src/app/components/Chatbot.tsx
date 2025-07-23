'use client';
import { useState, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Londrina_Solid } from 'next/font/google';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');

  // 🟡 Posición inicial en esquina inferior derecha
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Static initial state to prevent mismatch

  useEffect(() => {
    const newX = window.innerWidth - 80;
    const newY = window.innerHeight - 80;
    setPosition({ x: newX, y: newY });
  }, []);

  const previousPosition = useRef(position);

  const dragRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input.trim() } as const;
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      });

      const data = await response.json();
      const botMsg = { sender: 'bot', text: data.reply } as const;
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg = { sender: 'bot', text: '❌ Hubo un error al contactar al asistente.' } as const;
      setMessages((prev) => [...prev, errorMsg]);
    }

    setInput('');
  };

  // Reubicar el chat si se sale al abrirlo
  useEffect(() => {
    if (!open || !dragRef.current) return;

    const chatbox = dragRef.current;
    const { offsetWidth: width, offsetHeight: height } = chatbox;

    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - height;

    const adjustedX = Math.max(0, Math.min(position.x, maxX));
    const adjustedY = Math.max(0, Math.min(position.y, maxY));

    // Guardamos posición previa del ícono antes de abrir
    previousPosition.current = position;

    if (adjustedX !== position.x || adjustedY !== position.y) {
      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [open]);

  // Al cerrar el chat, restauramos posición original del botón
  useEffect(() => {
    if (!open) {
      setPosition(previousPosition.current);
    }
  }, [open]);

  // 🖱️ Eventos de arrastre
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      const chatbot = dragRef.current;
      if (!chatbot) return;

      const width = open ? chatbot.offsetWidth : 64;
      const height = open ? chatbot.offsetHeight : 64;

      const newX = Math.min(Math.max(0, clientX - offset.current.x), window.innerWidth - width);
      const newY = Math.min(Math.max(0, clientY - offset.current.y), window.innerHeight - height);

      setPosition({ x: newX, y: newY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches.length > 0) {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    };

    const stopDrag = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', stopDrag);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', stopDrag);
    };
  }, [open]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = dragRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }
  };

  return (
    <div
      ref={dragRef}
      className="fixed z-50"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {open ? (
        <div className="w-80 h-96 bg-white border rounded-xl shadow-lg flex flex-col touch-none">
          {/* Cabecera arrastrable */}
          <div
            className="bg-yellow-400 text-black p-3 rounded-t-xl font-bold flex justify-between items-center cursor-move"
            onMouseDown={startDrag}
            onTouchStart={startDrag}
          >
            <span>Asistente Virtual</span>
            <button onClick={() => setOpen(false)} className="text-black text-lg">✖</button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-white">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm p-2 rounded-lg max-w-[70%] ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-blue-200 text-black'
                    : 'bg-yellow-300 text-black'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex p-2 border-t bg-white">
            <input
              type="text"
              className="flex-1 text-sm border rounded px-2 py-1 text-black bg-white focus:outline-none"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 p-2 rounded text-white hover:bg-blue-600"
            >
              <SendHorizonal size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          className="w-16 h-16 bg-yellow-400 text-black rounded-full shadow-lg hover:scale-105 transition-transform text-2xl flex items-center justify-center cursor-move"
        >
          💬
        </button>
      )}
    </div>
  );
}
