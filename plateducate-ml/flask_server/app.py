from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_bootstrap import Bootstrap
from PIL import Image
import base64
import io

import os
import model, time

app = Flask(__name__, template_folder='template')
Bootstrap(app)

"""
Routes
"""
@app.route('/', methods=['GET','POST'])
def index():
    if request.method == 'POST':
        time.sleep(2)
        uploaded_file = request.files['file']
        if uploaded_file.filename != '':
            image_path = os.path.join('static', uploaded_file.filename)
            # print(image_path)
            uploaded_file.save(image_path)
            # print("Uploaded")
            # model_name, image_bb_path, class_name, scores, time_elapsed = model.get_prediction(image_path, uploaded_file.filename, 'ssd_mobilenet')
            # resultMobile = {
            #     'model_name': model_name,
            #     'class_with_scores': zip(class_name, scores),
            #     'image_path': image_bb_path, 
            #     'time_elapsed': time_elapsed
            # }

            model_name, image_bb_path, class_name, scores, time_elapsed = model.get_prediction_yolo(image_path, uploaded_file.filename, 'yolo-tf1')
            resultResnet = {
                'model_name': model_name,
                'class_with_scores': zip(class_name, scores),
                'image_path': image_bb_path, 
                'time_elapsed': time_elapsed
            }

            return render_template('result.html', resultResnet = resultResnet)
    return render_template('index.html')

@app.route('/receive_photo', methods=['POST', 'GET'])
def receive_photo():
    data = request.data
    decoded = base64.b64decode(data)
    image = Image.open(io.BytesIO(decoded))

    # dataType = str(type(data))
    # dataContent = str(data)
    # return jsonify({'ok': True, 'message': "ML flask server - image post request retrieved", 'data type': dataType, 'data content': dataContent}), 200

    # time.sleep(2)
    model_name, class_name, scores, time_elapsed = model.get_prediction_v2(image, 'ssd_mobilenet')
    resultMobile = {
        'model_name': model_name,
        'class_with_scores': {
            'class_name': class_name,
            'scores': scores
        },
        'time_elapsed': time_elapsed
    }

    model_name, class_name, scores, time_elapsed = model.get_prediction_v2(image, 'ssd_resnet101')
    resultResnet = {
        'model_name': model_name,
        # 'class_with_scores': zip(class_name, scores),
        'class_with_scores': {
            'class_name': class_name,
            'scores': scores
        },
        'time_elapsed': time_elapsed
    }

    if (resultResnet and resultMobile):
    # if (resultMobile):
    # if (resultResnet):
        return jsonify({'ok': True, 'message': "ML prediction result", 'resultMobile': resultMobile, 'resultResnet': resultResnet}), 200
        # return jsonify({'ok': True, 'message': "ML prediction result", 'resultMobile': resultMobile}), 200
        # return jsonify({'ok': True, 'message': "ML prediction result", 'resultMobile': resultResnet}), 200
    else:
        return jsonify({'ok': False, 'message': "ML flask server - no data found"}), 400

    # dataType = type(resultMobile)
    # if data:
    #     return jsonify({'ok': True, 'message': "ML flask server - image post request retrieved", 'dataType': dataType}), 200
    # else:
    #     return jsonify({'ok': False, 'message': "ML flask server - no data found", 'dataType': dataType}), 400



if __name__ == '__main__':
    # app.run(debug = True)
    app.run(debug=True, host='0.0.0.0')