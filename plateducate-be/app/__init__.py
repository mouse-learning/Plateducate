from flask import Flask, render_template, request, redirect

import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from .auth import auth
from dotenv import load_dotenv

from .objectDetection import objectDetection

app = Flask(__name__)

app.register_blueprint(auth)
app.register_blueprint(objectDetection)
app.secret_key = os.getenv("SECRET_KEY")

if __name__ == '__main__':
    app.run()
