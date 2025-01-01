from dotenv import load_dotenv, find_dotenv
import os
from typing import List
import requests
import json
import re

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
            sentences = re.findall("(\"|\')[^\"\']+(\"|\')", result['content'])
            return sentences[-1] if sentences else result['content']
        except Exception as e:
            return f"Could not find translated sentence. Error: {e}. Content: {json.loads(response.content)}"  
        
if __name__ == "__main__":
    translator = Translator()
    for i in range(10):
        text = translator.translate("Hello, world!")
        print("Iteration", i, ":", text)