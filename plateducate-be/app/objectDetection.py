from flask import Blueprint, request, jsonify
import requests

objectDetection = Blueprint('objectDetection', __name__)

@objectDetection.route('/submit_photo', methods=['POST', 'GET'])
def submit_photo():
    if request.method == 'POST':
        base64Image = request.data
        url = 'http://localhost:5000/receive_photo'
        response = requests.post(url, data=base64Image)

        if response:
            return (response.text, response.status_code, response.headers.items())
        else:
            return jsonify({'ok': False, 'message': "no response from the model"}), 500        

    return jsonify({'ok': False, 'message': "False request method"}), 400