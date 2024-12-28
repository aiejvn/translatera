from dotenv import load_dotenv, find_dotenv
import os
from typing import List
import requests
import json

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

        response = requests.get(url = self.api_url + "available_models")
        response = json.loads(response._content)
        
        models = response["models"]
        models = sorted(models.items(), key = lambda x: -x[1])
        model = models[0][0]

        self.payload = {
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a master translator."
                }
            ],
            "max_tokens": 100,
            "temperature": 0,
            "request_timeout_time": 240
        }

    

    def translate(self, input:str, original:str="English", target:str = "French")->str:
        # If no language is provided, assumes input should be EN->FR
        # Get the biggest model available - those tend to be good at translation
        self.payload["messages"].append({
            "role":"user",
            "content":f"Translate {input} from {original} to {target}."
        })
        response = requests.post(url=self.api_url + "chat/completions", headers=self.headers, json=self.payload)

        # Output the response
        print(response.status_code)
        print(response.json())
   

if __name__ == "__main__":
    translator = Translator()
    translator.translate("Hello, world!")