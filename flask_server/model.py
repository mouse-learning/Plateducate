from re import DEBUG
from flask import jsonify
import tensorflow as tf
import numpy as np
import os
import requests, time, logging
from object_detection.utils import visualization_utils as viz_utils
from object_detection.utils import label_map_util
from PIL import Image
from pprint import pprint
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('TkAgg') 

SIZE=128
MODEL_URI = 'http://localhost:8501/v1/models/ssd_mobilenet:predict'
# MODEL_URI = 'http://tensorflow-serving:8501/v1/models/ssd_mobilenet:predict'
CLASSES = ['cat', 'dog']
PATH_TO_LABELS = './label_name_100.pbtxt'
category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS,
                                                                    use_display_name=True)

# LOAD IMAGE, RUN IT THROUGH DETECTION MODEL AND VISUALIZE DETECTION RESULTS
def load_image_into_numpy_array(path):
  """Load an image from file into a numpy array.

  Puts image into numpy array to feed into tensorflow graph.
  Note that by convention we put it into a numpy array with shape
  (height, width, channels), where channels=3 for RGB.

  Args:
    path: the file path to the image

  Returns:
    uint8 numpy array with shape (img_height, img_width, 3)
  """
  return np.array(Image.open(path))

def get_prediction(imagePath, fileName):
  # image = tf.keras.preprocessing.image.load_img(imagePath, target_size=(SIZE, SIZE))
  # image = tf.keras.preprocessing.image.img_to_array(image)

  '''ssd_mobilenet
  For MobileNetV2, call tf.keras.applications.mobilenet_v2.preprocess_input 
  on your inputs before passing them to the model. mobilenet_v2.preprocess_input 
  will scale input pixels between -1 and 1.
  https://www.tensorflow.org/api_docs/python/tf/keras/applications/mobilenet_v2/MobileNetV2
  
  '''
  # image = mobilenet_v2.preprocess_input(image)
  # image = np.expand_dims(image, axis=0)

  # data = json.dumps({
  #     'instances': image.tolist()
  # })
  # response = requests.post(MODEL_URI, data=data.encode('utf-8'))
  # result = json.loads(response.text)
  # print(result)
  # prediction = np.squeeze(result['predictions'][0])
  # class_name = CLASSES[int(prediction > 0.5)]
  # return class_name

  # image_np = load_image_into_numpy_array(imagePath)
  # input_tensor = tf.convert_to_tensor(image_np)
  #   # The model expects a batch of images, so add an axis with `tf.newaxis`.
  # input_tensor = input_tensor[tf.newaxis, ...]
  # payload = {"instances": [image_np.tolist()]}
  # start = time.perf_counter()
  # res = requests.post(MODEL_URI, json=payload)
  # print(f"Took {time.perf_counter()-start:.2f}s")
  # detections = res.json()






  # OBJECT DETECTION MODEL
  image_np = load_image_into_numpy_array(imagePath)
  

  payload = {"instances": [image_np.tolist()]}
  start = time.perf_counter()
  res = requests.post(MODEL_URI, json=payload)
  print(f"Took {time.perf_counter()-start:.2f}s")
  detections = res.json()


  detections = detections['predictions'][0]

  # with open('output.txt', 'wt') as out:
  #   pprint(detections, stream=out)

  num_detections = int(detections.pop('num_detections'))
  for key, value in detections.items():
    print(key)
    arrShape = np.shape(value)
    # print(arrShape)

    # IF ARRAY IS ONE-DIMENSIONAL, CONVERT TO 2D ARRAY FIRST
    if len(arrShape) == 1:
      value = np.reshape(value, (arrShape[0], -1))
    else:
      value = np.reshape(value, (arrShape[0], arrShape[1]))

    # print(np.shape(value))
    wanted_val = value[0, :num_detections]
    if len(wanted_val) != 1:
      wanted_val_shape = np.shape(wanted_val)

      wanted_val = np.reshape(wanted_val, (1, wanted_val_shape[0]))
    # if len(wanted_val_shape) == 1:
    #   wanted_val = np.reshape(wanted_val, (wanted_val_shape[0], -1))
    # else:
    #   wanted_val = np.reshape(wanted_val, (wanted_val_shape[0], wanted_val_shape[1]))
    print(type(wanted_val), np.shape(wanted_val))
    detections[key] = wanted_val
  # detections = {key: value[0, :num_detections].numpy()
  #                 for key, value in detections.items()}
  print('yayyy')
  detections['num_detections'] = num_detections

  # detection_classes should be ints.
  detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

  image_np_with_detections = image_np.copy()

  with open('detection_boxes.txt', 'wt') as out:
    pprint(detections, stream=out)

  viz_utils.visualize_boxes_and_labels_on_image_array(
        image_np_with_detections,
        detections['detection_boxes'],
        detections['detection_classes'],
        detections['detection_scores'],
        category_index,
        use_normalized_coordinates=True,
        max_boxes_to_draw=200,
        min_score_thresh=.30,
        agnostic_mode=False)

  # fig = plt.figure()
  # plt.imshow(image_np_with_detections)
  # print('Done')
  im = Image.fromarray(image_np_with_detections)
  new_image_path = os.path.join('static', fileName)
  im.save(new_image_path)
  # plt.show()
  def GetClassName(data):
   for cl in data:
    return cl['name']

  #data processed
  classes = detections['detection_classes']
  scores = detections['detection_scores']

  data = [category_index.get(value) for index,value in enumerate(classes)]
  class_name = GetClassName(data)
  print(GetClassName(data))

  return new_image_path, class_name