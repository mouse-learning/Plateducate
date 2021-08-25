from flask import Blueprint

auth = Blueprint('main', __name__)

@auth.route('/add_user', methods=['POST'])
def add_user():
    return 'Successfully Added User', 201

@auth.route('/fetch_movies', methods=['POST'])
def fetch_user():

    users = []
    return users, 201