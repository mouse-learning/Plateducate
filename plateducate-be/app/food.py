import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import datetime
from .database import db
from dotenv import load_dotenv

from flask import Flask, Blueprint, render_template, request, redirect, url_for, logging, session, flash, jsonify, current_app
from flask_bcrypt import generate_password_hash, check_password_hash
from passlib.hash import sha256_crypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

food = Blueprint('food', __name__)

@food.route('/add_food', methods=['POST'])
def add_food():
    if request.method == 'POST':
        # try:
        payload = request.get_json()
        userID = payload["userID"]
        food_name = payload["food_name"]
        protein = payload["protein"]
        carbs = payload["carbs"]
        fat = payload["fat"]
        fiber = payload["fiber"]
        now = datetime.datetime.now()
        ts = now.strftime('%Y-%m-%d %H:%M:%S')

        db.execute(
            "INSERT INTO plateducate.consumption_records(UserID, FoodName, DateOfConsumption, Proteins_100g, Carbs_100g, Fats_100g, Fiber_100g) VALUES (:USER_ID, :food_name, :ts, :protein, :carbs, :fat, :fiber)",
            {"USER_ID": userID, "food_name": food_name, "ts": ts, "protein": protein, "carbs": carbs, "fat": fat,
                "fiber": fiber})
        
        db.commit()
        
        return jsonify({'ok': True, 'message': "Success inserting user to database"}), 200
    return jsonify({'ok': False, 'message': "False request method"}), 400

        # except:
        #     return jsonify({'ok': False, 'message': "Exception found committing to database"}), 400

# def fetch_food(userID):
#     if request.method == 'GET':
#         food_query = db.execute("SELECT * FROM Plateducate.consumption_records WHERE username=:username", {"username":username}).fetchone()


#     return jsonify({'ok': False, 'message': "False request method"}), 400
