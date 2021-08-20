from flask import Flask, render_template, url_for, request, redirect
from flask_bootstrap import Bootstrap

import os
import model, time

# static_url_path='' removes any preceding path from the URL (i.e. the default /static).
# static_folder='web/static' to serve any files found in the folder web/static as static files.
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
            # LOCALLY
            # image_path = os.path.join('static', uploaded_file.filename)
            # WITH DOCKER COMPOSE (RAN FROM ROOT ABOVE flask_server to be able to access serving dir, so diff path. Locally, we run from inside flask_server)
            image_path = os.path.join('flask_server/static', uploaded_file.filename)
            print(image_path)
            uploaded_file.save(image_path)
            print("Uploaded")
            class_name = model.get_prediction(image_path)
            result = {
                'class_name': class_name,
                'image_path': image_path,
            }
            return render_template('result.html', result = result)
    return render_template('index.html')

if __name__ == '__main__':
    # app.run(debug = True)
    app.run(debug=True, host='0.0.0.0')