from translator import Translator
import os
from flask import Flask, render_template, request, redirect, url_for, Response
import json
from dotenv import load_dotenv
import datetime

app = Flask(__name__)
translator = Translator()

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/translate")
def translate():
    return f"<p>{translator.translate("Hello World!")}</p>"

@app.route("/")
def main():
    return render_template(
        "page.tsx",
        title="translatera"
        # url=os.getenv("URL")
    )

if __name__ == "__main__":
    app.run(debug=True, port=8000)