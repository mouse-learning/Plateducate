import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from flask import Flask, Blueprint, render_template, request, redirect, url_for, logging, session, flash, jsonify, current_app
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from passlib.hash import sha256_crypt
from .database import db
from dotenv import load_dotenv

auth = Blueprint('auth', __name__)
USER_ID = None

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
        # try:
        if password == confirm:
            db.execute("INSERT INTO plateducate.users(firstname, lastname, username, email, password) VALUES (:firstname, :lastname, :username, :email, :password)",
                    {"firstname":firstname, "lastname":lastname, "username":username, "email":email, "password":secure_password})
            db.commit()
            return jsonify({'ok': True, 'message': "Success inserting user to database"}), 400
        else:
            return jsonify({'ok': False, 'message': "Password confirmation does not match"}), 400
        # except:
        #     return jsonify({'ok': False, 'message': "Exception found committing to database"}), 500

    return jsonify({'ok': False, 'message': "False request method"}), 400


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


@auth.route('/logout')
def logout():
    session.clear()
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


@auth.route('/add_user', methods=['POST'])
def add_user():
    return 'Successfully Added User', 201


@auth.route('/fetch_movies', methods=['POST'])
def fetch_user():

    users = []
    return users, 201