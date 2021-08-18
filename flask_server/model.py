from re import DEBUG
import tensorflow as tf
import numpy as np
import json
import requests, time, logging
from tensorflow.keras.applications import mobilenet_v2

SIZE=128
MODEL_URI = 'http://tensorflow-serving/v1/models/pets:predict'
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
    prediction = np.squeeze(result['predictions'][0])
    class_name = CLASSES[int(prediction > 0.5)]
    return class_name