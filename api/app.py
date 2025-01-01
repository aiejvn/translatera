from translator import Translator
import os
from flask import Flask, jsonify, render_template, request
import json
from dotenv import load_dotenv
import datetime
from flask_cors import CORS

# from proj root:
# python3 ./api/app.py

# env file contains environment (debug/production)

app = Flask(__name__)
CORS(app) # enables next js to make backend requests to flask
translator = Translator()

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/translate", methods=['GET'])
def translate():
    content = request.args.get("content")
    input_language = request.args.get('input_language')
    output_language = request.args.get('output_language')
    
    # print(input_language, output_language, content)
    return jsonify({
        'message':translator.translate(content, original=input_language, target=output_language)
    })

@app.route("/")
def main():
    return render_template(
        "page.tsx",
        title="translatera"
        # url=os.getenv("URL")
    )

if __name__ == "__main__":
    app.run(debug=True, port=8080, load_dotenv=True)