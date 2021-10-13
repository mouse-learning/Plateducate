from flask import Flask, render_template, request, redirect

import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from .auth import auth
from dotenv import load_dotenv

from flask_jwt_extended import JWTManager

from .objectDetection import objectDetection

__all__ = ["jwt"]

app = Flask(__name__)
jwt = JWTManager(app)

app.register_blueprint(auth)
app.register_blueprint(objectDetection)
app.secret_key = os.getenv("SECRET_KEY")

if __name__ == '__main__':
    app.run()
