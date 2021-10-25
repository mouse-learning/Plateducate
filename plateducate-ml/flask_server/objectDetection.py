from flask import Blueprint, render_template, request, jsonify, make_response
from PIL import Image
# from bson import json_util
import base64
import io
import model

objectDetection = Blueprint('objectDetection', __name__)


@objectDetection.route('/receive_photo', methods=['POST', 'GET'])
def receive_photo():
    data = request.data
    decoded = base64.b64decode(data)
    image = Image.open(io.BytesIO(decoded))

    images_bb = {}
    model_name, image_bb, class_name_w_scores, time_elapsed = model.get_prediction_yolo_conversion(image, 'yolo-tf1')
    resultYOLO = {
        'model_name': model_name,
        'class_with_scores': class_name_w_scores,
        'time_elapsed': time_elapsed,
        'base64_str': image_bb,
    }

    if resultYOLO:
        # sanitized_resp = json.loads(json_util.dumps({'ok': True, 'message': "ML prediction result", 'resultYOLO': resultYOLO}))
        resp = make_response(jsonify({'ok': True, 'message': "ML prediction result", 'resultYOLO': resultYOLO}), 200)
        return resp
    else:
        return jsonify({'ok': False, 'message': "ML flask server - no data found"}), 500
