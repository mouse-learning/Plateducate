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
MAX_BOXES_TO_DRAW = 1
MIN_SCORE_THRESH = 0.3
PATH_TO_LABELS = './label_name_100.pbtxt'
category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS,
                                                                    use_display_name=True)

def convertLabelToStr(data):
  model_name_str = data.split("_")

  model_name_str = " ".join(model_name_str).upper()

  return model_name_str


def GetClassNameAndScoreList(data):
  classes_arr = []
  scores_arr = []
  for cl, score in data:
    class_name = convertLabelToStr(cl['name'])
    classes_arr.append(class_name)
    score = round(score*100)
    scores_arr.append(score)
  return classes_arr, scores_arr

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

def get_prediction(imagePath, fileName, modelName):
  # MODEL_URI = 'http://localhost:8501/v1/models/' + modelName + ':predict'
  MODEL_URI = 'http://tensorflow-serving:8501/v1/models/' + modelName + ':predict'
  # MODEL_URI = 'http://tensorflow-serving:8501/v1/models/ssd_mobilenet:predict'


  # OBJECT DETECTION MODEL
  image_np = load_image_into_numpy_array(imagePath)
  # image_np = np.expand_dims(image_np, 0)

  payload = {"instances": [image_np.tolist()]}
  start = time.perf_counter()
  res = requests.post(MODEL_URI, json=payload)
  end = time.perf_counter()
  time_elapsed = end-start
  print(f"Took {time_elapsed:.2f}s")
  time_elapsed = round(time_elapsed, 2)
  detections = res.json()

  # The JSON Response is a dictionary with key 'predictions'.
  # We only want the value of this key which is equiv. to
  # output of the model when ran in predict.py (from TFOD Tutorial)
  detections = detections['predictions'][0]
  # with open('detection_boxes.txt', 'wt') as out:
  #   pprint(detections, stream=out)

  # with open('output.txt', 'wt') as out:
  #   pprint(detections, stream=out)

  num_detections = int(detections.pop('num_detections'))
  # detections = {key: value[0, :num_detections].numpy()
  #                 for key, value in detections.items()}

  for key,value in detections.items():
    # Expand dim of np arr first before slicing
    value_expanded = np.expand_dims(value, 0)

    # Do slicing
    detections[key] = value_expanded[0, :num_detections]

  print('yayyy')
  detections['num_detections'] = num_detections

  # detection_classes should be ints.
  detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

  image_np_with_detections = image_np.copy()


  viz_utils.visualize_boxes_and_labels_on_image_array(
        image_np_with_detections,
        detections['detection_boxes'],
        detections['detection_classes'],
        detections['detection_scores'],
        category_index,
        use_normalized_coordinates=True,
        max_boxes_to_draw=MAX_BOXES_TO_DRAW,
        min_score_thresh=MIN_SCORE_THRESH,
        agnostic_mode=False)


  im = Image.fromarray(image_np_with_detections)
  new_image_path = os.path.join('static', modelName + fileName)
  im.save(new_image_path)


  #Data processed
  classes = detections['detection_classes']
  scores = detections['detection_scores']

  num_of_boxes_actually_drawn = 0
  for i in scores:
    if i >= MIN_SCORE_THRESH:
      num_of_boxes_actually_drawn += 1
  
  num_of_boxes_actually_drawn = min(num_of_boxes_actually_drawn, MAX_BOXES_TO_DRAW)

  data = []
  for value, score in zip(classes, scores):
    data.append((category_index.get(value), score)) # tuple of class name with score
    class_names, scores = GetClassNameAndScoreList(data)


  model_name_str = convertLabelToStr(modelName)


  return model_name_str, new_image_path, class_names[:num_of_boxes_actually_drawn], scores[:num_of_boxes_actually_drawn], time_elapsed