from re import DEBUG
from flask import jsonify
import tensorflow as tf
import numpy as np
import json
import requests, time, logging
from tensorflow.keras.applications import mobilenet_v2

SIZE=128
# MODEL_URI = 'http://localhost:8501/v1/models/pets:predict'
MODEL_URI = 'http://tensorflow-serving:8501/v1/models/pets:predict'
CLASSES = ['cat', 'dog']

def get_prediction(imagePath):
    image = tf.keras.preprocessing.image.load_img(imagePath, target_size=(SIZE, SIZE))
    image = tf.keras.preprocessing.image.img_to_array(image)

    '''

    Preprocessed numpy.array or a tf.Tensor with type float32.
    The inputs pixel values are scaled between -1 and 1, sample-wise.
    For MobileNetV2, call tf.keras.applications.mobilenet_v2.preprocess_input 
    on your inputs before passing them to the model. mobilenet_v2.preprocess_input 
    will scale input pixels between -1 and 1.
    https://www.tensorflow.org/api_docs/python/tf/keras/applications/mobilenet_v2/MobileNetV2
    
    '''
    image = mobilenet_v2.preprocess_input(image)
    image = np.expand_dims(image, axis=0)

    data = json.dumps({
        'instances': image.tolist()
    })
    response = requests.post(MODEL_URI, data=data.encode('utf-8'))
    result = json.loads(response.text)
    print(result)
    prediction = np.squeeze(result['predictions'][0])
    class_name = CLASSES[int(prediction > 0.5)]
    return class_name

    # r = requests.post(MODEL_URI, json=data)

     # Decoding results from TensorFlow Serving server
    # prediction = json.loads(r.content.decode('utf-8'))

    # prediction = (np.array(prediction['predictions'])[0] > 0.5).astype(np.int)

    # class_name = CLASSES[int(prediction > 0.5)]




    # data = json.dumps({"signature_name": "serving_default", "instances":imlst})
    # data = json.dumps({
    #     'instances': image.tolist()
    # })
    # headers = {"content-type": "application/json"}
    # json_response = requests.post(MODEL_URI, data=data, headers=headers)
    # out = np.array((json.loads(json_response.text)['predictions']))

    # # Returning JSON response
    # return jsonify({"status": 200, "message": out.shape})

    # return result