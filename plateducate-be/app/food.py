import os, sys
from typing import DefaultDict; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import datetime, json
from .database import db
from collections import defaultdict
from decimal import Decimal
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
        db.close()
        
        
        return jsonify({'ok': True, 'message': "Success inserting user to database"}), 200
    return jsonify({'ok': False, 'message': "False request method"}), 400

        # except:
        #     return jsonify({'ok': False, 'message': "Exception found committing to database"}), 400

@food.route('/fetch_food/<userID>', methods=['GET'])
def fetch_food(userID):
    if request.method == 'GET':
        food_query = db.execute("SELECT * FROM plateducate.consumption_records WHERE UserID=:UserID", {"UserID":userID}).fetchall()
        db.close()
        res = defaultdict(list)
        for i in food_query:
            food = i._asdict()
            food['TimeOfConsumption'] = food['DateOfConsumption'].strftime("%H:%M:%S")
            res[food['DateOfConsumption'].strftime("%Y-%m-%d")].append(food)
        
        # res = json.dumps(({str(k):v for k,v in res.items()}))
        return jsonify({'ok': True, 'message': "Success fetching food record", "result": res}), 200

    return jsonify({'ok': False, 'message': "False request method"}), 400

@food.route('/fetch_food_today/<userID>', methods=['GET'])
def fetch_food_today(userID):
    if request.method == 'GET':
        now = datetime.datetime.now()
        date_today = now.strftime('%Y-%m-%d')
        print(userID)
        food_query = db.execute("SELECT CAST(DateOfConsumption AS DATE) AS 'date', SUM(Energy_100g) AS 'total_energy', SUM(Proteins_100g) AS 'total_proteins', \
            SUM(Carbs_100g) AS 'total_carbs', SUM(Fats_100g) AS 'total_fats' FROM plateducate.consumption_records WHERE UserID=:UserID AND \
            DateOfConsumption LIKE :date_today GROUP BY CAST(DateOfConsumption as DATE);", {"UserID":userID, "date_today": '%'+ date_today + '%'}).fetchall()

        db.close()
        res = defaultdict(list)
        print(food_query)
        nutrients = food_query[0]._asdict()
        print("Nutrients: ", nutrients)
        res['date'] = nutrients['date']
        res['total_energy'] = float(nutrients['total_energy'])
        res['total_proteins'] = nutrients['total_proteins']
        res['total_carbs'] = nutrients['total_carbs']
        res['total_fats'] = nutrients['total_fats']
        
        return jsonify({'ok': True, 'message': "Success fetching food record", "result": res}), 200

    return jsonify({'ok': False, 'message': "False request method"}), 400

@food.route('/delete_food', methods=['POST'])
def delete_food():
    if request.method == 'POST':
        try:
            payload = request.get_json()
            foodID = payload["foodID"]
            food_query = db.execute("DELETE FROM plateducate.consumption_records WHERE ID=:ID", {"ID": foodID})
            db.commit()
            db.close()

            return jsonify({'ok': True, 'message': "Success deleting food record with ID: "+str(foodID)}), 200
        except: 
            return jsonify({'ok': False, 'message': "Exception found committing to database"}), 400
    
    return jsonify({'ok': False, 'message': "False request method"}), 400