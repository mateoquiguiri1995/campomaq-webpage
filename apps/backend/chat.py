import json
import os

from flask import Blueprint, Response, current_app, jsonify, request, stream_with_context
from openai import OpenAI

from common import error_response, format_exception_message


chat_bp = Blueprint("chat", __name__)

OPENAI_CHAT_MODEL = os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini")
OPENAI_TIMEOUT_SECONDS = float(os.getenv("OPENAI_TIMEOUT_SECONDS", "30"))

CHAT_SYSTEM_PROMPT = (
    "Eres MAQUI, el asistente virtual de Campomaq. "
    "Responde en espanol claro, breve y util. "
    "Te especializas en maquinaria agricola, repuestos, implementos, mantenimiento, "
    "recomendaciones de uso y orientacion comercial inicial. "
    "Si falta informacion para recomendar una maquina o repuesto, haz una sola pregunta "
    "de aclaracion y luego orienta. "
    "No inventes stock, precios, garantias, tiempos de entrega ni politicas si no fueron "
    "confirmados. Cuando no sepas algo, dilo con honestidad y sugiere contactar a Campomaq al numero 0996517233."
)

_openai_client = None


def get_openai_client():
    global _openai_client

    if _openai_client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY environment variable is required")
        _openai_client = OpenAI(
            api_key=api_key,
            timeout=OPENAI_TIMEOUT_SECONDS,
        )

    return _openai_client


def build_chat_messages(user_message):
    return [
        {"role": "system", "content": CHAT_SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ]


@chat_bp.post("/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    user_message = (payload.get("message") or "").strip()

    if not user_message:
        return error_response("No message provided", 400)

    try:
        response = get_openai_client().chat.completions.create(
            model=OPENAI_CHAT_MODEL,
            messages=build_chat_messages(user_message),
            temperature=0.2,
            max_tokens=180,
        )
        reply = (response.choices[0].message.content or "").strip()
        return jsonify({"reply": reply, "model": OPENAI_CHAT_MODEL})
    except Exception as exc:
        current_app.logger.exception("Chat request failed")
        return error_response("Chat request failed", 500, exc)


@chat_bp.post("/chat/stream")
def chat_stream():
    payload = request.get_json(silent=True) or {}
    user_message = (payload.get("message") or "").strip()

    if not user_message:
        return error_response("No message provided", 400)

    @stream_with_context
    def generate():
        full_reply = []

        try:
            stream = get_openai_client().chat.completions.create(
                model=OPENAI_CHAT_MODEL,
                messages=build_chat_messages(user_message),
                temperature=0.2,
                max_tokens=180,
                stream=True,
            )

            for chunk in stream:
                delta = chunk.choices[0].delta.content or ""
                if not delta:
                    continue
                full_reply.append(delta)
                yield f"data: {json.dumps({'delta': delta}, ensure_ascii=False)}\n\n"

            yield (
                "event: done\n"
                f"data: {json.dumps({'reply': ''.join(full_reply)}, ensure_ascii=False)}\n\n"
            )
        except Exception as exc:
            current_app.logger.exception("Streaming chat request failed")
            yield (
                "event: error\n"
                f"data: {json.dumps({'error': format_exception_message(exc)}, ensure_ascii=False)}\n\n"
            )

    headers = {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
    }
    return Response(generate(), mimetype="text/event-stream", headers=headers)
