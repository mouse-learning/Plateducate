import requests
from flask import Flask, Blueprint, render_template, request, redirect, url_for, logging, session, flash, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from passlib.hash import sha256_crypt
from .database import db

auth = Blueprint('auth', __name__)

@auth.route('/')
def home():
    return render_template('home.html')


@auth.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        firstname = request.form.get("firstname")
        lastname = request.form.get("lastname")
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        confirm = request.form.get("confirm")
        secure_password = sha256_crypt.encrypt(str(password))
        try: 
            if password == confirm:
                db.execute("INSERT INTO plateducate.users(firstname, lastname, username, email, password) VALUES (:firstname, :lastname, :username, :email, :password)",
                        {"firstname":firstname, "lastname":lastname, "username":username, "email":email, "password":secure_password})
                db.commit()
                return jsonify({'ok': True, 'message': "Success inserting user to database"}), 400
            else:
                return jsonify({'ok': False, 'message': "Password confirmation does not match"}), 400
        except:
            return jsonify({'ok': False, 'message': "Exception found committing to database"}), 500

    return jsonify({'ok': False, 'message': "False request method"}), 400


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get("name")
        password = request.form.get("password")

        usernamedata = db.execute("SELECT username FROM users WHERE username=:username", {"username":username}).fetchone()
        passworddata = db.execute("SELECT password FROM users WHERE username=:username", {"username":username}).fetchone()

        if usernamedata is None:
            flash("No username", "danger")
            return render_template("login.html")
        else:
            print(passworddata)
            for password_d in passworddata:
                if sha256_crypt.verify(password, password_d):
                    session["logged_in"] = True # add this session variable into your nav bar to display logout/login options
                    flash("You are now logged in")
                    return redirect(url_for("photo"))
                else:
                    flash("incorrect password", "danger")
                    return render_template('login.html')

    return render_template('login.html')

# Temporary route - change to other file later!
@auth.route('/submit_photo', methods=['POST'])
def submit_photo():
    url = 'http://localhost:3000/receive_photo'
    base64Image = request.data
    response = requests.post(url, data=base64Image)

    # dataIsBytes = True if type(base64Image) == bytes else False
    # return jsonify({'ok': True, 'message': "image post request sent", 'typeIsBytes': dataIsBytes}), 200

    return (response.text, response.status_code, response.headers.items())

@auth.route('/logout')
def logout():
    session.clear()
    flash("You are now logged out", "success")
    return redirect(url_for('login'))

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