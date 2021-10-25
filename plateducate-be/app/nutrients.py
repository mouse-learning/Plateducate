from flask import Blueprint, request, jsonify
import re
import openfoodfacts
from openfoodfacts.products import search

nutrients = Blueprint('nutrients', __name__)

@nutrients.route('/nut_fetching', methods=['POST'])
def submit_photo():
    if request.method == 'POST':
        data = (request.get_json())

        food_nutritions = {}
        for food in data:
            food_name = re.sub("[^0-9a-zA-Z]+", " ", food)

            if 'egg' in food_name.lower() or 'eggs' in food_name.lower():
                search_result = openfoodfacts.products.search('egg')
            elif 'tofu' in food_name.lower() or 'ganmodoki' in food_name.lower() :
                search_result = openfoodfacts.products.search('tofu')
            else:
                search_result = openfoodfacts.products.search(food_name)

            
            if not search_result['products']:
                last_food_word = food_name.split(" ")[-1]
                search_result = openfoodfacts.products.search(last_food_word)

            if not search_result['products']:
                food_nutritions[food_name] = "Food not found"
            else:
                food_nutritions[food_name] = search_result['products'][0]['nutriments']
            

        if len(food_nutritions) == len(data):
            return jsonify({'ok': True, 'message': "image post request sent", 'food_nutritions': food_nutritions}), 200
        else:
            return jsonify({'ok': False, 'message': "no data for this food is available"}), 500

    return jsonify({'ok': False, 'message': "False request method"}), 400
