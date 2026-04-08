'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { BsRobot } from 'react-icons/bs';
import clsx from 'clsx';

const CHAT_W = 380;
const CHAT_H = 520;
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  isStreaming?: boolean;
};

type StreamEvent = {
  eventName: string;
  payload: Record<string, unknown>;
};

function parseSseBlock(block: string): StreamEvent | null {
  const lines = block.split('\n');
  let eventName = 'message';
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }

  if (!dataLines.length) {
    return null;
  }

  return {
    eventName,
    payload: JSON.parse(dataLines.join('\n')) as Record<string, unknown>,
  };
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(1);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const toggleOpen = () => setOpen((prev) => !prev);

  const createMessage = (sender: Message['sender'], text: string, isStreaming = false): Message => ({
    id: nextMessageIdRef.current++,
    sender,
    text,
    isStreaming,
  });

  const updateBotMessage = (messageId: number, updater: (message: Message) => Message) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === messageId ? updater(message) : message))
    );
  };

  const finalizeBotMessage = (messageId: number, text?: string) => {
    updateBotMessage(messageId, (message) => ({
      ...message,
      text: text ?? message.text,
      isStreaming: false,
    }));
  };

  const fetchFallbackReply = async (content: string) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content }),
    });

    if (!response.ok) {
      throw new Error('Fallback chat request failed');
    }

    const data = (await response.json()) as { reply?: string };
    return data.reply?.trim() || 'No pude generar una respuesta en este momento.';
  };

  const streamReply = async (content: string, botMessageId: number) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        Accept: 'text/event-stream',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: content }),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      throw new Error('Streaming chat request failed');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let streamedText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split('\n\n');
      buffer = blocks.pop() || '';

      for (const block of blocks) {
        const event = parseSseBlock(block);
        if (!event) {
          continue;
        }

        if (event.eventName === 'error') {
          const errorMessage =
            typeof event.payload.error === 'string'
              ? event.payload.error
              : 'Streaming chat request failed';
          throw new Error(errorMessage);
        }

        if (event.eventName === 'done') {
          finalizeBotMessage(
            botMessageId,
            typeof event.payload.reply === 'string' ? event.payload.reply : streamedText
          );
          continue;
        }

        const delta = typeof event.payload.delta === 'string' ? event.payload.delta : '';
        if (!delta) {
          continue;
        }

        streamedText += delta;
        updateBotMessage(botMessageId, (message) => ({
          ...message,
          text: streamedText,
          isStreaming: true,
        }));
      }
    }

    finalizeBotMessage(botMessageId);
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) {
      return;
    }

    const userMessage = createMessage('user', content);
    const botMessage = createMessage('bot', '', true);

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
    setLoading(true);

    try {
      await streamReply(content, botMessage.id);
    } catch (streamError) {
      try {
        const fallbackReply = await fetchFallbackReply(content);
        finalizeBotMessage(botMessage.id, fallbackReply);
      } catch {
        updateBotMessage(botMessage.id, (message) => ({
          ...message,
          text: message.text || 'No pude contactar al asistente en este momento.',
          isStreaming: false,
        }));
      }

      if (streamError instanceof Error) {
        console.error('[Chatbot] Streaming failed, fallback used:', streamError.message);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const quickOptions = [
    'Quiero ayuda para elegir una maquina agricola',
    'Busco repuestos para mi equipo',
    'Que productos tienen en oferta',
    'Como puedo contactar a un asesor',
  ];

  return (
    <div className="fixed bottom-5 right-3 left-3 z-50 sm:left-auto">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.16 }}
            className="flex h-[min(520px,calc(100vh-7rem))] w-[min(380px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur"
            style={{ maxWidth: CHAT_W, maxHeight: CHAT_H }}
          >
            <div className="flex items-center justify-between border-b border-black/5 bg-gradient-to-r from-campomaq via-yellow-400 to-amber-300 px-4 py-3 text-black">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-black p-2.5 shadow-sm">
                  <Bot className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-extrabold tracking-[0.18em]">MAQUI</div>
                  <div className="text-xs text-black/70">Asistente de Campo Maq</div>
                </div>
              </div>
              <button
                onClick={toggleOpen}
                className="rounded-full p-1.5 transition-colors hover:bg-black/10"
                aria-label="Cerrar chatbot"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-stone-50 via-white to-yellow-50/30">
              <div className="space-y-3 p-4">
                {messages.length === 0 ? (
                  <div className="flex h-[350px] flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-black p-4 shadow-sm">
                      <Bot size={34} className="text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Hola, soy Maqui</h3>
                    <p className="mt-2 max-w-[280px] text-sm text-gray-600">
                      Puedo ayudarte con maquinaria agricola, repuestos, implementos y
                      orientacion inicial para encontrar lo que necesitas.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {quickOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => sendMessage(option)}
                          disabled={loading}
                          className="rounded-full border border-yellow-300 bg-white px-3 py-2 text-sm text-gray-800 transition hover:border-yellow-400 hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.14 }}
                    className={clsx(
                      'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm',
                      message.sender === 'user'
                        ? 'ml-auto rounded-br-md bg-black text-white'
                        : 'rounded-bl-md border border-gray-200 bg-white text-gray-800'
                    )}
                  >
                    {message.text ? (
                      <span className="whitespace-pre-wrap">{message.text}</span>
                    ) : message.isStreaming ? (
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-yellow-400 [animation-delay:-0.2s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-yellow-400 [animation-delay:-0.1s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-yellow-400" />
                      </span>
                    ) : null}
                  </motion.div>
                ))}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-black/5 bg-white px-3 py-3">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-stone-50 p-1">
                <input
                  type="text"
                  disabled={loading}
                  className="h-11 flex-1 bg-transparent px-3 text-sm text-black outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Escribe tu consulta..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:scale-[1.03] hover:bg-campomaq hover:text-black disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                  aria-label="Enviar mensaje"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-2 px-2 text-xs text-gray-500">
                {loading ? 'Respondiendo en tiempo real...' : 'Respuestas rapidas y orientativas.'}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleOpen}
            className="ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-[0_18px_40px_rgba(0,0,0,0.24)] transition-colors hover:bg-campomaq hover:text-black"
            aria-label="Abrir chatbot"
          >
            <BsRobot size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
