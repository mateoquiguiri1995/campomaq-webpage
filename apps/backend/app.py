# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import openai
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env
_ = load_dotenv(find_dotenv())
openai.api_key = os.environ['OPENAI_API_KEY']


# Create Flask app
app = Flask(__name__)
CORS(app)

# OpenAI client
client = OpenAI()

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful agricultural machinery assistant who help with short and concise answers in spanish."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.0,
            max_tokens=100,
        )
        reply = response.choices[0].message.content.strip()
        print(user_message)
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
