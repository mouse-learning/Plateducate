import os, sys
from typing import DefaultDict; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import datetime
from .database import db
from collections import defaultdict
from dotenv import load_dotenv

from flask import Flask, Blueprint, render_template, request, redirect, url_for, logging, session, flash, jsonify, current_app


food = Blueprint('food', __name__)

@food.route('/add_food', methods=['POST'])
def add_food():
    if request.method == 'POST':
        # try:
        payload = request.get_json()
        userID = payload["userID"]
        food_name = payload["food_name"]
        energy = payload["energy"]
        protein = payload["protein"]
        carbs = payload["carbs"]
        fat = payload["fat"]
        now = datetime.datetime.now()
        ts = now.strftime('%Y-%m-%d %H:%M:%S')

        db.execute(
            "INSERT INTO plateducate.consumption_records(UserID, FoodName, DateOfConsumption, Proteins_100g, Carbs_100g, Fats_100g, Energy_100g) \
                VALUES (:USER_ID, :food_name, :ts, :protein, :carbs, :fat, :energy)",
            {"USER_ID": userID, "food_name": food_name, "ts": ts, "protein": protein, "carbs": carbs, "fat": fat,
                "energy": energy})
        
        db.commit()
        
        return jsonify({'ok': True, 'message': "Success inserting user to database"}), 200
    return jsonify({'ok': False, 'message': "False request method"}), 400

        # except:
        #     return jsonify({'ok': False, 'message': "Exception found committing to database"}), 400

@food.route('/fetch_food/<userID>', methods=['GET'])
def fetch_food(userID):
    if request.method == 'GET':
        food_query = db.execute("SELECT * FROM Plateducate.consumption_records WHERE UserID=:UserID", {"UserID":userID}).fetchall()
        res = defaultdict(list)
        for i in food_query:
            food = i._asdict()
            res[food['DateOfConsumption'].strftime("%Y-%m-%d")].append(food)
        
        # res = json.dumps(({str(k):v for k,v in res.items()}))
        return jsonify({'ok': True, 'message': "Success fetching food record", "result": res}), 200

    return jsonify({'ok': False, 'message': "False request method"}), 400