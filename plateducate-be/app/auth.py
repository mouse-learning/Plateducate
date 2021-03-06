import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import datetime
from .database import db
from dotenv import load_dotenv

from flask import Flask, Blueprint, render_template, request, redirect, url_for, logging, session, flash, jsonify, current_app
from flask_bcrypt import generate_password_hash, check_password_hash
from passlib.hash import sha256_crypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

auth = Blueprint('auth', __name__)

@auth.route('/')
def home():
    return render_template('home.html')


@auth.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        payload = request.get_json()
        username = payload["username"]
        email = payload["email"]
        password = generate_password_hash(payload["password"])
        confirm = payload["confirm"]
        try:
            if check_password_hash(password, confirm):
                db.execute("INSERT INTO plateducate.users(username, email, password) VALUES (:username, :email, :password)",
                        {"username":username, "email":email, "password":password})
                db.commit()
                return jsonify({'ok': True, 'message': "Success inserting user to database"}), 200
            else:
                return jsonify({'ok': False, 'message': "Password confirmation does not match"}), 400
        except:
            return jsonify({'ok': False, 'message': "Exception found committing to database"}), 400

    return jsonify({'ok': False, 'message': "False request method"}), 400


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        payload = request.get_json()
        username = payload["username"]
        password = payload["password"]

        user_query = db.execute("SELECT UserID, username, password FROM plateducate.users WHERE username=:username", {"username":username}).fetchone()
        if user_query and check_password_hash(user_query['password'], password):
            access_token = create_access_token(identity=payload)

            return jsonify({'ok': True, 'message': "Succesfully logged in", 'access_token': access_token, 'user_id': str(user_query['UserID'])}), 200
        else:
            return jsonify({'ok': False, 'message': "Invalid username or password"}), 400
    
    return jsonify({'ok': False, 'message': "False request method"}), 400

@auth.route('/logout')
def logout():
    # reset the current USER_ID
    global USER_ID
    USER_ID = None
    flash("You are now logged out", "success")
    return redirect(url_for('login'))


@auth.route('/profile', methods=['GET'])
def get_profile():

    first_name = db.execute("SELECT FirstName FROM users WHERE UserID=:USER_ID", {"USER_ID":USER_ID}).fetchone()
    last_name = db.execute("SELECT LastName FROM users WHERE UserID=:USER_ID", {"USER_ID": USER_ID}).fetchone()
    profile_pic = db.execute("SELECT ImgSrc FROM users WHERE UserID=:USER_ID", {"USER_ID": USER_ID}).fetchone()

    print(first_name, last_name, profile_pic, USER_ID)

    return jsonify({'ok': True, 'message': "Profile fetched"}), 200

# dummy page to display after user successfully logged in
@auth.route('/photo')
def photo():
    return render_template("photo.html")
    