from flask import Blueprint, request, jsonify
import re
import openfoodfacts
from openfoodfacts.products import search

nutrients = Blueprint('nutrients', __name__)

@nutrients.route('/nut_fetching', methods=['POST'])
def submit_photo():
    data = (request.get_json())['food_name']
    food_name = re.sub("[^0-9a-zA-Z]+", " ", data)
    
    search_result = openfoodfacts.products.search(food_name)
    food_nutritions = search_result['products'][0]['nutriments']

    return jsonify({'message': "image post request sent", 'ok': True, 'food_nutritions': food_nutritions}), 200