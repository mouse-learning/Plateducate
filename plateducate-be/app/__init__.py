from flask import Flask, render_template, request, redirect

import os
from .auth import auth

def create_app():
    app = Flask(__name__)

    app.register_blueprint(auth)

    return app