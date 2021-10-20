from flask import Flask, render_template, request, redirect

import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from dotenv import load_dotenv

from .auth import auth
from .food import food
from .objectDetection import objectDetection
from .nutrients import nutrients

from flask_jwt_extended import JWTManager


__all__ = ["jwt"]

app = Flask(__name__)
jwt = JWTManager(app)

app.register_blueprint(auth)
app.register_blueprint(objectDetection)
app.register_blueprint(nutrients)
app.register_blueprint(food)
app.secret_key = os.getenv("SECRET_KEY")

if __name__ == '__main__':
    app.run()
