from flask import Flask, request, render_template
from flask_bootstrap import Bootstrap
import time, os, model

from objectDetection import objectDetection

app = Flask(__name__, template_folder='template')
Bootstrap(app)

app.register_blueprint(objectDetection)


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
if __name__ == '__main__':
    # app.run(debug = True)
    app.run(debug=True, host='0.0.0.0')