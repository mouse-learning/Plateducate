from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

    return app