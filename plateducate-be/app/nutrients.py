from flask import Blueprint, request, jsonify
import re
import openfoodfacts
from openfoodfacts.products import search

nutrients = Blueprint('nutrients', __name__)

@nutrients.route('/nut_fetching', methods=['POST'])
def submit_photo():
    if request.method == 'POST':
        data = (request.get_json())['food_name']
        food_name = re.sub("[^0-9a-zA-Z]+", " ", data)
        
        search_result = openfoodfacts.products.search(food_name)

        if search_result['products']:
            food_nutritions = search_result['products'][0]['nutriments']

            return jsonify({'ok': True, 'message': "image post request sent", 'food_nutritions': food_nutritions}), 200
        else:
            return jsonify({'ok': False, 'message': "no data for this food is available"}), 500

    return jsonify({'ok': False, 'message': "False request method"}), 400
