from flask import Blueprint, jsonify, request
from flask_bcrypt import generate_password_hash
from . import db

from database.schema import validate_user

auth = Blueprint('auth', __name__)

BASE_URL = "http://localhost:3000"

@auth.route('/register', methods=['POST'])
def register():
    validate = validate_user(request.form)
    if validate['ok']:
        payload = validate['data']
        print(payload)
        hashed = generate_password_hash(payload['password']) 
        try:
            cursor = db.connect().cursor()
            query = "INSERT INTO Plateducate.Users\
                Values (%s, %s, %s, %s, %s, %s, %s)"
            
            # Optional fields
            firstName = None if 'firstName' not in payload else payload['firstName']
            lastName = None if 'lastName' not in payload else payload['lastName']
            cursor.execute()
            print(payload["firstNames"])
            return jsonify({'ok': True, 'message': "success"}), 200
        except:
            return jsonify({'ok': False, 'message': 'Exception while inserting data'}), 200
    else:
        return jsonify({'ok': False,'message': "Bad request parameters: {}".format(validate['message'])}), 200


    return 'Successfully Added User', 201

@auth.route('/fetch_movies', methods=['POST'])
def fetch_user():

    users = []
    return users, 201