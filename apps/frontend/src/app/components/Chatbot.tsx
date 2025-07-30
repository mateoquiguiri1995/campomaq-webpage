'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Tractor, MessageCircle, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

/* ---------- constants ---------- */
const CHAT_W = 420;
const CHAT_H = 600;
const BTN_SIZE = 80;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstOpen, setFirstOpen] = useState(true);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonPosRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar posición en esquina inferior derecha
  useEffect(() => {
    const x = window.innerWidth - BTN_SIZE - 24;
    const y = window.innerHeight - BTN_SIZE - 24;
    setPosition({ x, y });
    buttonPosRef.current = { x, y };
  }, []);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mantener el chat dentro de los límites de la pantalla
  const keepInside = (x: number, y: number, w: number, h: number) => ({
    x: Math.max(0, Math.min(x, window.innerWidth - w)),
    y: Math.max(0, Math.min(y, window.innerHeight - h)),
  });

  // Manejar el movimiento del chat
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      const w = open ? CHAT_W : BTN_SIZE;
      const h = open ? CHAT_H : BTN_SIZE;
      const next = keepInside(clientX - offset.current.x, clientY - offset.current.y, w, h);
      setPosition(next);
    };

    const onMouse = (e: MouseEvent) => isDragging.current && handleMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) =>
      isDragging.current && e.touches[0] && handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const stop = () => (isDragging.current = false);

    document.addEventListener('mousemove', onMouse);
    document.addEventListener('mouseup', stop);
    document.addEventListener('touchmove', onTouch);
    document.addEventListener('touchend', stop);

    return () => {
      document.removeEventListener('mousemove', onMouse);
      document.removeEventListener('mouseup', stop);
      document.removeEventListener('touchmove', onTouch);
      document.removeEventListener('touchend', stop);
    };
  }, [open]);

  // Iniciar el arrastre
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = { x: clientX - rect.left, y: clientY - rect.top };
    }
  };

  // Alternar apertura/cierre del chat
  const toggleOpen = () => {
    if (!open) {
      // Abrir el chat
      buttonPosRef.current = { ...position };
      const { x, y } = keepInside(
        position.x + BTN_SIZE / 2 - CHAT_W / 2,
        position.y - CHAT_H - 16,
        CHAT_W,
        CHAT_H
      );
      const finalY = y < 0 ? position.y + BTN_SIZE + 16 : y;
      setPosition({ x, y: finalY });
      setVisible(true);
      setOpen(true);
      
      if (firstOpen) {
        setFirstOpen(false);
      }
    } else {
      // Cerrar el chat - Animación más suave
      setOpen(false);
      setTimeout(() => {
        setVisible(false);
        setPosition(buttonPosRef.current);
      }, 200); // Ajustado para coincidir con la duración de la animación
    }
  };

  // Enviar mensaje a la API
  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg = { sender: 'user' as const, text: content };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://campomaq.azurewebsites.net/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();
      const botMsg = { sender: 'bot' as const, text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = { 
        sender: 'bot' as const, 
        text: '❌ Hubo un error al contactar al asistente. Por favor intenta nuevamente.' 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Opciones rápidas
  const quickOptions = [
    '¿Qué productos tienen en oferta?',
    'Necesito ayuda con mi pedido',
    '¿Cómo realizo una devolución?',
    'Quiero consultar métodos de pago',
    '¿Cuál es el tiempo de entrega?'
  ];

  return (
    <div
      ref={containerRef}
      className="fixed z-50"
      style={{ left: position.x, top: position.y }}
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden touch-none border border-gray-200"
          >
            {/* Header */}
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 flex justify-between items-center cursor-move"
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              <div className="flex items-center gap-3">
                <div className="bg-black rounded-full p-2">
                  <Bot className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <span className="font-bold text-lg">CAMPI</span>
                  <div className="text-xs text-gray-800">Asistente de Campomaq</div>
                </div>
              </div>
              <button
                onClick={toggleOpen}
                className="text-black hover:bg-black/10 rounded-full p-1 transition"
                aria-label="Cerrar chat"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
              <div className="p-4 space-y-3">
                {messages.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Bot size={80} className="text-yellow-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">¡Hola! Soy Campi, tu asistente Virtual</h3>
                    <p className="text-gray-600 mt-2 max-w-[280px]">
                      Estoy aquí para ayudarte con cualquier pregunta sobre nuestros productos, envíos o pagos.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                      {quickOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => sendMessage(option)}
                          className="px-3 py-1.5 text-sm bg-yellow-100 text-black rounded-full hover:bg-yellow-200 transition border border-yellow-300"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      'max-w-[75%] px-4 py-2 rounded-xl text-sm shadow-sm',
                      msg.sender === 'user'
                        ? 'ml-auto bg-yellow-400 text-black rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    )}
                  >
                    {msg.text}
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    <span>Buscando información...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm
                           focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100 text-black"
                  placeholder="Escribe tu pregunta..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500
                           disabled:bg-gray-300 transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!visible && (
          <motion.button
            key="button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleOpen}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-full shadow-2xl
                     flex items-center justify-center cursor-grab active:cursor-grabbing"
            aria-label="Abrir chat de asistente"
          >
            <MessageCircle size={32} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}