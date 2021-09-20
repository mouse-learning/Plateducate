import requests
import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from flask import Flask, Blueprint, render_template, request, redirect, url_for, logging, session, flash, jsonify, current_app
import datetime
from passlib.hash import sha256_crypt
from dotenv import load_dotenv
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from .database import db

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
        password = payload["password"]
        confirm = payload["confirm"]
        secure_password = sha256_crypt.encrypt(str(password))
        try:
            if password == confirm:
                db.execute("INSERT INTO plateducate.users(username, email, password) VALUES (:username, :email, :password)",
                        {"username":username, "email":email, "password":secure_password})
                db.commit()
                return jsonify({'ok': True, 'message': "Success inserting user to database"}), 200
            else:
                return jsonify({'ok': False, 'message': "Password confirmation does not match"}), 400
        except:
            return jsonify({'ok': False, 'message': "Exception found committing to database"}), 400

    return jsonify({'ok': False, 'message': "False request method"}), 200


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get("name")
        password = request.form.get("password")

        usernamedata = db.execute("SELECT Username FROM Plateducate.users WHERE Username=:username", {"username":username}).fetchone()
        passworddata = db.execute("SELECT Password FROM Plateducate.users WHERE Username=:username", {"username":username}).fetchone()
        userid = db.execute("SELECT UserID FROM Plateducate.users WHERE Username=:username", {"username":username}).fetchone()

        if usernamedata is None:
            #flash("No username", "danger")
            return jsonify({'ok': False, 'message': "No Username"}), 400
        else:
            print(passworddata)
            for password_d in passworddata:
                if sha256_crypt.verify(password, password_d):
                    #session["logged_in"] = True # add this session variable into your nav bar to display logout/login options
                    #session["userID"] = userid
                    #flash("You are now logged in")

                    return jsonify({'ok': True, 'message': "You are now logged in"}), 200
                    # return redirect(url_for("photo"))
                else:
                    #flash("incorrect password", "danger")
                    return jsonify({'ok': False, 'message': "Incorrect password"}), 400

    return jsonify({'ok': True, 'message': "Success login"}), 200

<<<<<<< HEAD
=======
# Temporary route - change to other file later!
@auth.route('/submit_photo', methods=['POST'])
def submit_photo():
    base64Image = request.data
    dataIsBytes = True if type(base64Image) == bytes else False

    return jsonify({'ok': True, 'message': "image post request sent", 'typeIsBytes': dataIsBytes}), 200

>>>>>>> 07c28a6 (add route to retrieve post request of base64 image)
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


@auth.route('/add_food', methods=['GET', 'POST'])
def add_food():
    global USER_ID
    print(USER_ID)
    if request.method == 'POST':
        if USER_ID is not None:
            food = request.form.get("food")
            ts = datetime.datetime.now().timestamp()
            protein = request.form.get("protein")
            carbs = request.form.get("carbs")
            fat = request.form.get("fat")
            fiber = request.form.get("fiber")

            db.execute(
                "INSERT INTO plateducate.consumption_records VALUES (:USER_ID, :food, :ts, :protein, :carbs, :fat, :fiber)",
                {"USER_ID": USER_ID, "food": food, "ts": ts, "protein": protein, "carbs": carbs, "fat": fat,
                 "fiber": fiber})
            db.commit()
            return jsonify({'ok': True, 'message': "Success inserting user to database"}), 200
        else:
            return jsonify({'ok': False, 'message': "User not logged in"}), 400


# dummy page to display after user successfully logged in
@auth.route('/photo')
def photo():
    return render_template("photo.html")


@auth.route('/add_user', methods=['POST'])
def add_user():
    return 'Successfully Added User', 201


@auth.route('/fetch_movies', methods=['POST'])
def fetch_user():

    users = []
    return users, 201