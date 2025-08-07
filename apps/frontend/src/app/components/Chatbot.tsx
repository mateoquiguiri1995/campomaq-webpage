'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const CHAT_W = 380;
const CHAT_H = 520;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleOpen = () => setOpen(!open);

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
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '❌ Error al contactar al asistente.' }
      ]);
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
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }} // sin movimiento ni cambio de posición
            transition={{ duration: 0.15 }}
            className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            style={{ width: CHAT_W, height: CHAT_H }}
          >
            {/* Header */}
            <div className="bg-campomaq text-black p-4 flex justify-between items-center">
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
                  <div className="flex flex-col items-center justify-center h-[350px] text-center">
                    <Bot size={70} className="text-campomaq mb-4" />
                    <h3 className="text-lg font-bold text-gray-800">¡Hola! Soy Maqui</h3>
                    <p className="text-gray-600 mt-2 max-w-[260px]">
                      Estoy aquí para ayudarte a solventar tus dudas.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                      {quickOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => sendMessage(option)}
                          className="px-3 py-1 text-sm text-black bg-yellow-100 border border-yellow-300 rounded-full hover:bg-yellow-200"
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
                      'max-w-[75%] px-3 py-2 rounded-xl text-sm shadow-sm',
                      msg.sender === 'user'
                        ? 'ml-auto bg-campomaq text-black rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    )}
                  >
                    {msg.text}
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100 text-black"
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
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!open && (
          <motion.button
            key="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleOpen}
            className="w-16 h-16 bg-campomaq text-black rounded-full shadow-2xl flex items-center justify-center"
          >
            <MessageCircle size={38} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
