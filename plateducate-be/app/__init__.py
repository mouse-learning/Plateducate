from flask import Flask, render_template, request, redirect

import os
from .auth import auth
from .objectDetection import objectDetection

app = Flask(__name__)

app.register_blueprint(auth)
app.register_blueprint(objectDetection)

if __name__ == '__main__':
    app.run()
