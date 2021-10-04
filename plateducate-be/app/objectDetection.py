from flask import Blueprint, request, jsonify
import requests

objectDetection = Blueprint('objectDetection', __name__)

@objectDetection.route('/submit_photo', methods=['POST', 'GET'])
def submit_photo():
    base64Image = request.data
    # url = 'http://localhost:5000/receive_photo'
    # response = requests.post(url, data=base64Image)

    dataType = str(type(base64Image))
    dataContent = str(base64Image)
    return jsonify({'dataType': dataType, 'message': "image post request sent", 'ok': True, 'dataContent': dataContent}), 200

    # return (response.text, response.status_code, response.headers.items())