#!/usr/bin/env python3
from flask import Flask, request, jsonify
from flask_cors import CORS
from best_model import analyze_tweet

app = Flask(__name__)
CORS(app)

@app.route('/', methods=["GET"])
def home():
    return "API is live! POST to /analyze"

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json() or {}
        tweet = data.get('tweet', '').strip()
        if not tweet:
            return jsonify({'error': 'No tweet'}), 400

        score, keywords = analyze_tweet(tweet, return_keywords=1)
        return jsonify({'score': score, 'keywords': keywords})

    except Exception as e:
        print("ERROR:", e)
        import traceback; traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Backend -> http://127.0.0.1:5000")
    app.run(host='127.0.0.1', port=5000, debug=True)