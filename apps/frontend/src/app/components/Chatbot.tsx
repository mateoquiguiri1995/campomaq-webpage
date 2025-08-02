'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const CHAT_W = 420;
const CHAT_H = 600;
const BTN_SIZE = 80;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonPosRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Asegura que el chat esté dentro de la pantalla
  const keepInside = (x: number, y: number, w: number, h: number) => ({
    x: Math.max(0, Math.min(x, window.innerWidth - w)),
    y: Math.max(0, Math.min(y, window.innerHeight - h)),
  });

  // Posicionar inicialmente en esquina inferior derecha
  useEffect(() => {
    const x = window.innerWidth - BTN_SIZE - 24;
    const y = window.innerHeight - BTN_SIZE - 24;
    setPosition({ x, y });
    buttonPosRef.current = { x, y };
  }, []);

  // Ajustar posición si se cambia el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const size = open ? { w: CHAT_W, h: CHAT_H } : { w: BTN_SIZE, h: BTN_SIZE };
      setPosition((prev) => keepInside(prev.x, prev.y, size.w, size.h));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

  // Auto scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Movimiento del chat
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      const size = open ? { w: CHAT_W, h: CHAT_H } : { w: BTN_SIZE, h: BTN_SIZE };
      setPosition(keepInside(clientX - offset.current.x, clientY - offset.current.y, size.w, size.h));
    };

    const onMouseMove = (e: MouseEvent) => isDragging.current && handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) =>
      isDragging.current && handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const stopDrag = () => (isDragging.current = false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', stopDrag);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', stopDrag);
    };
  }, [open]);

  // Inicia arrastre
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) offset.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  // Abrir / cerrar chat
  const toggleOpen = () => {
    if (!open) {
      buttonPosRef.current = { ...position };
      const { x, y } = keepInside(
        position.x + BTN_SIZE / 2 - CHAT_W / 2,
        position.y - CHAT_H - 16,
        CHAT_W,
        CHAT_H
      );
      setPosition({ x, y: y < 0 ? position.y + BTN_SIZE + 16 : y });
      setVisible(true);
      setOpen(true);
    } else {
      setOpen(false);
      setTimeout(() => {
        setVisible(false);
        setPosition(buttonPosRef.current);
      }, 200);
    }
  };

  // Enviar mensaje
  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: content }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://campomaq.azurewebsites.net/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: '❌ Error al contactar al asistente.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickOptions = [
    '¿Qué productos tienen en oferta?',
    'Necesito ayuda con mi pedido',
    'Quiero consultar métodos de pago',
    '¿Cuál es el tiempo de entrega?'
  ];

  return (
    <div ref={containerRef} className="fixed z-50" style={{ left: position.x, top: position.y }}>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
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
                  <span className="font-bold text-lg">MAQUI</span>
                  <div className="text-xs text-gray-800">Asistente de Campomaq</div>
                </div>
              </div>
              <button onClick={toggleOpen} className="hover:bg-black/10 rounded-full p-1">
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
              <div className="p-4 space-y-3">
                {messages.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Bot size={80} className="text-yellow-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">¡Hola! Soy Maqui</h3>
                    <p className="text-gray-600 mt-2 max-w-[280px]">
                      Estoy aquí para ayudarte a solventar tus dudas.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                      {quickOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => sendMessage(option)}
                          className="px-3 py-1.5 text-sm text-black bg-yellow-100 border border-yellow-300 rounded-full hover:bg-yellow-200"
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100 text-black"
                  placeholder="Escribe tu pregunta..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 disabled:bg-gray-300 transition-all hover:scale-105 active:scale-95"
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
            className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <MessageCircle size={42} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
