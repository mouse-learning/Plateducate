from flask import Blueprint, jsonify, request

auth = Blueprint('auth', __name__)

BASE_URL = "http://localhost:3000"

@auth.route('/add_user', methods=['POST'])
def add_user():
    return 'Successfully Added User', 201

@auth.route('/fetch_movies', methods=['POST'])
def fetch_user():

    users = []
    return users, 201