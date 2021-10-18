from flask import Flask, render_template, url_for, request, redirect, jsonify, make_response
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
            # model_name, image_bb_path, class_name, scores, time_elapsed = model.get_prediction(image_path, uploaded_file.filename, 'yolo-tf1')
            # resultMobile = {
            #     'model_name': model_name,
            #     'class_with_scores': zip(class_name, scores),
            #     'image_path': image_bb_path, 
            #     'time_elapsed': time_elapsed
            # }

            model_name, image_bb_path, class_name, scores, time_elapsed = model.predict_yolo_serving(image_path, uploaded_file.filename, 'yolo-tf1')
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

    images_bb = {}
    model_name, image_bb, class_name, scores, time_elapsed = model.get_prediction_yolo_conversion(image, 'yolo-tf1')
    resultYOLO = {
        'model_name': model_name,
        'class_with_scores': {
            'class_name': class_name,
            'scores': scores
        },
        'time_elapsed': time_elapsed
    }
    images_bb['yolo'] = image_bb
    print(resultYOLO)

    # model_name, image_bb, class_name, scores, time_elapsed = model.get_prediction_v2(image, 'ssd_resnet101')
    # resultResnet = {
    #     'model_name': model_name,
    #     'class_with_scores': {
    #         'class_name': class_name,
    #         'scores': scores
    #     },
    #     'time_elapsed': time_elapsed
    # }
    # images_bb.append(image_bb)

    if resultYOLO:
        resp = make_response(jsonify({'ok': True, 'message': "ML prediction result", 'resultYOLO': resultYOLO}), 200)
        resp.headers['images_bb'] = images_bb
        return resp
    else:
        return jsonify({'ok': False, 'message': "ML flask server - no data found"}), 500


if __name__ == '__main__':
    # app.run(debug = True)
    app.run(debug=True, host='0.0.0.0')