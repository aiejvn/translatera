from dotenv import load_dotenv, find_dotenv
import requests
import os
from flask import Flask, jsonify, render_template, request
import json
from dotenv import load_dotenv
import datetime
from flask_cors import CORS

class Translator:

    def __init__(self):
        load_dotenv(find_dotenv())
        api_key = os.getenv("INFERA_API_KEY")
        self.api_url = "https://api.infera.org/"

        self.headers = {
            "accept": "application/json",
            "api_key": api_key,  
            "Content-Type": "application/json"
        }

        self.payload = {
            "model": "llama3.1:8b",
            "messages": [],
            "max_tokens": 120,
            "temperature": 0.9,
            "request_timeout_time": 240
        }

    def translate(self, input:str, original:str="English", target:str = "French")->str:
        # If no language is provided, assumes input should be EN->FR
        # Get the biggest model available - those tend to be good at translation
        self.payload["messages"].append({
            "role":"user",
            "content":f"Translate {input} from {original} to {target}. Output should contain words from {target} only."
        })
        response = requests.post(url=self.api_url + "chat/completions", headers=self.headers, json=self.payload)

        # Output the response
        if response.status_code != 200:
            print("Received error", response.status_code)
        
        try:
            result = json.loads(response._content)["choices"][0]['message']
            self.payload["messages"].append(result)
            # sentences = re.findall("(\"|\')[^\"\']+(\"|\')", result['content'])
            # print(result['content'])
            # return sentences[-1] if sentences else result['content']
            return result['content']
        except Exception as e:
            return f"Could not find translated sentence. Error: {e}. Content: {json.loads(response.content)}"  

def test_translator():
    translator = Translator()
    for i in range(10):
        text = translator.translate("Hello, world!")
        print("Iteration", i, ":", text)

# from proj root:
# flask run

# env file contains environment (debug/production)

app = Flask(
    __name__,
    # template_folder="app",
    # static_folder='app',
    # static_url_path=''        
            )

# CORS(app) # enables next js to make backend requests to flask
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

# @app.route("/")
# def main():
#     return jsonify({'message':'Flask cannot handle dynamic React pages. Stop rendering using Flask.'}), 404

if __name__ == "__main__":
    app.run(debug=True, port=8080, load_dotenv=True)