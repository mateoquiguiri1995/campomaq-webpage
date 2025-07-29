// app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message } = await request.json();

  // Aquí va tu lógica para responder al mensaje del usuario.
  // Por ahora vamos a simular una respuesta sencilla:
  let reply = '🤖 No entendí tu mensaje.';

  if (message.includes('hola')) reply = '¡Hola! ¿En qué puedo ayudarte?';
  else if (message.includes('precio')) reply = 'Nuestros productos van desde $10 hasta $99.';
  else if (message.includes('ayuda')) reply = 'Claro, dime qué necesitas.';

  return NextResponse.json({ reply });
}
