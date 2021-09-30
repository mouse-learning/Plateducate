from re import DEBUG
from flask import jsonify
import numpy as np
import os, json, cv2
import requests, time, logging
# from object_detection.utils import visualization_utils as viz_utils
# from object_detection.utils import label_map_util
from darkflow.net.build import TFNet
from PIL import Image
from pprint import pprint

SIZE=128
MAX_BOXES_TO_DRAW = 1
MIN_SCORE_THRESH = 0.3
# PATH_TO_LABELS = './label_name_100.pbtxt'/media/nardiena/7C1247391246F7A22/Documents/programming-projects/plateducate-with-datasets/Plateducate/plateducate-ml/flask_server
# category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS,
#                                                                     use_display_name=True)

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



def get_prediction_yolo(imagePath, fileName, modelName):
  # MODEL_URI = 'http://localhost:8501/v1/models/' + modelName + ':predict'
  MODEL_URI = 'http://tensorflow-serving:8501/v1/models/' + modelName + ':predict'


  options = {"model": "yolo-src/cfg/yolov2-food100.cfg", "load": "yolo-src/weights/yolov2-food100_10000.weights", "labels": "yolo-src/labels.txt", "threshold": 0.1}
  tfnet = TFNet(options)


  # OBJECT DETECTION MODEL
  im = cv2.imread(imagePath)
  img_shape = im.shape[:2]
  # print(img_shape)
  # cv2.imshow("lalala", im)
  # cv2.waitKey(0)
  # cv2.destroyAllWindows()
  imsz = cv2.resize(im, (416, 416))
  imsz = imsz / 255.
  imsz = imsz[:, :, ::-1]
  reshaped_img_shape = imsz.shape[:2]
  scale = np.flipud(np.divide(reshaped_img_shape, img_shape))  # you have to flip because the image.shape is (y,x) but your corner points are (x,y)
  # print(scale)


  payload = '{"signature_name":"predict", "instances" : [{"input": %s}]}' % imsz.tolist()
  start = time.perf_counter()
  res = requests.post(MODEL_URI, data=payload)
  end = time.perf_counter()
  time_elapsed = end-start
  print(f"Took {time_elapsed:.2f}s")
  time_elapsed = round(time_elapsed, 2)

  json_response = json.loads(res.text)
  with open('res.txt', 'wt') as out:
    pprint(json_response, stream=out)
  net_out = np.squeeze(np.array(json_response['predictions'], dtype='float32'))
  # with open('net.txt', 'wt') as out:
  #   pprint(net_out, stream=out)
  detections = res.json()

  # The JSON Response is a dictionary with key 'predictions'.
  # We only want the value of this key which is equiv. to
  # output of the model when ran in predict.py (from TFOD Tutorial)
  detections = detections['predictions'][0]

  boxes = tfnet.framework.findboxes(net_out)
  h, w, _ = imsz.shape
  threshold = tfnet.FLAGS.threshold
  boxesInfo = list()
  for box in boxes:
      tmpBox = tfnet.framework.process_box(box, h, w, threshold)
      if tmpBox is None:
          continue
      boxesInfo.append({
          "label": tmpBox[4],
          "confidence": tmpBox[6],
          "topleft": {
              "x": tmpBox[0],
              "y": tmpBox[2]},
          "bottomright": {
              "x": tmpBox[1],
              "y": tmpBox[3]}
      })

  class_names_w_scores = []
  new_image_path = os.path.join('static', modelName + fileName)
  imrsz = cv2.resize(im, (416, 416))
  imrsz = imrsz / 255.
  # imrsz = imrsz[:, :, ::-1]
  for prediction in boxesInfo:
      # print(prediction)
      old_top_left = np.array([prediction['topleft']['x'], prediction['topleft']['y']])
      old_bottom_right = np.array([prediction['bottomright']['x'], prediction['bottomright']['y']])

      new_top_left_corner = np.multiply(old_top_left, scale)
      new_bottom_right_corner = np.multiply(old_bottom_right, scale )
      # print("New top left: ", new_top_left_corner)
      # print("New bottom right:", new_bottom_right_corner)

      cv2.rectangle(imrsz, (int(old_top_left[0]), int(old_top_left[1])), (int(old_bottom_right[0]), int(old_bottom_right[1])), (255,0,0))
      new_img = cv2.convertScaleAbs(imrsz, alpha=(255.0))
      new_img = cv2.resize(new_img, img_shape)
      cv2.imwrite(new_image_path,new_img)
      # cv2.imshow("lalala", new_img)
      # cv2.waitKey(0)
      # cv2.destroyAllWindows()
      class_names_w_scores.append((prediction['label'], prediction['confidence']))
      # {'label': 'bibimbap', 'confidence': 0.80018985, 'topleft': {'x': 67, 'y': 5}, 'bottomright': {'x': 415, 'y': 409}}

  class_names_w_scores = np.array(class_names_w_scores)
  class_names = class_names_w_scores[:, 0]
  scores = class_names_w_scores[:, 1]

  model_name_str = convertLabelToStr(modelName)

  




  return model_name_str, new_image_path, class_names, scores, time_elapsed

def get_prediction(imagePath, fileName, modelName):
  MODEL_URI = 'http://localhost:8501/v1/models/' + modelName + ':predict'
  # MODEL_URI = 'http://tensorflow-serving:8501/v1/models/' + modelName + ':predict'


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
  with open('res.txt', 'wt') as out:
    pprint(detections, stream=out)

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


  # Data processed
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

def load_image_into_numpy_array_v2(img):
  """Load an image from file into a numpy array.

  Puts image into numpy array to feed into tensorflow graph.
  Note that by convention we put it into a numpy array with shape
  (height, width, channels), where channels=3 for RGB.

  Args:
    path: the file path to the image

  Returns:
    uint8 numpy array with shape (img_height, img_width, 3)
  """
  return np.array(img)

def get_prediction_v2(imageFile, modelName):
  MODEL_URI = 'http://localhost:8501/v1/models/' + modelName + ':predict'
  # MODEL_URI = 'http://tensorflow-serving:8501/v1/models/' + modelName+ ':predict'


  # OBJECT DETECTION MODEL
  image_np = load_image_into_numpy_array_v2(imageFile)
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

  # Data processed
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


  # return model_name_str, new_image_path, class_names[:num_of_boxes_actually_drawn], scores[:num_of_boxes_actually_drawn], time_elapsed
  return model_name_str, class_names[:num_of_boxes_actually_drawn], scores[:num_of_boxes_actually_drawn], time_elapsed