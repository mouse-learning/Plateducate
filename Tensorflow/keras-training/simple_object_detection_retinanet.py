'''
Source Code: https://curiousily.com/posts/object-detection-on-custom-dataset-with-tensorflow-2-and-keras-using-python/
'''
import os
import xml.etree.ElementTree as ET
import pandas as pd
from pprint import pprint
import urllib
import tensorflow as tf
import cv2


def create_dict_dataframe_from_path(dataset_path):
    counter = 0
    dataset = dict()
    dataset["image_name"] = list()
    dataset["min_x"] = list()
    dataset["min_y"] = list()
    dataset["max_x"] = list()
    dataset["max_y"] = list()
    dataset["class_name"] = list()
    
    for _, _, files in os.walk(dataset_path):
        
        for image in files:
            file_name, file_extension = os.path.splitext(image)

            if file_extension != ".jpg": continue
            
            dataset["image_name"].append(
            f'../images/training/{image}'
            )

            # XML
            # Pass the path of the xml documents
            tree = ET.parse(f'../images/training/{file_name}.xml')

            root = tree.getroot()

            width = int(root[4][0].text)
            height = int(root[4][1].text)

            # print(type(int(root[6][4][0].text)))
            dataset["min_x"].append(
                int(round(int(root[6][4][0].text) * width))
            )
            dataset["min_y"].append(
                int(round(int(root[6][4][1].text) * height))
            )
            dataset["max_x"].append(
                int(round(int(root[6][4][2].text) * width))   
            )
            dataset["max_y"].append(
                int(round(int(root[6][4][3].text) * height))   
            )
            dataset["class_name"].append(
                root[6][0].text 
            )
            counter += 1
        print("Processed {} food images.".format(counter))

    print("Length of min_x: ", len(dataset["min_x"]))
    print("Length of min_y: ", len(dataset["min_y"]))
    print("Length of max_x: ", len(dataset["max_x"]))
    print("Length of max_y: ", len(dataset["max_y"]))

    print("Length of class_name: ", len(dataset["class_name"]))
    print("Length of image_name: ", len(dataset["image_name"]))

    with open('dataset_data.txt', 'wt') as out:
        pprint(dataset, stream=out)

    return pd.DataFrame(dataset)

# from simple_object_detection_retinanet import *
# create_dict_dataframe_from_path('/media/nardiena/7C1247391246F7A22/Documents/programming-projects/plateducate-with-datasets/Plateducate/Tensorflow/images/training')

# PREPROCESSING

train_path = '/media/nardiena/7C1247391246F7A22/Documents/programming-projects/plateducate-with-datasets/Plateducate/Tensorflow/images/training'
train_df = create_dict_dataframe_from_path(train_path)

test_path = '/media/nardiena/7C1247391246F7A22/Documents/programming-projects/plateducate-with-datasets/Plateducate/Tensorflow/images/test'
test_df = create_dict_dataframe_from_path(test_path)


ANNOTATIONS_FILE = 'annotations/annotations.csv'
CLASSES_FILE = 'annotations/classes.csv'

train_df.to_csv(ANNOTATIONS_FILE, index=False, header=None)

classes = set()
for i in train_df['class_name']:
    classes.add(i)

with open(CLASSES_FILE, 'w') as f:
    for i, line in enumerate(sorted(classes)):
        f.write('{},{}\n'.format(line, i))

PRETRAINED_MODEL = './snapshots/_pretrained_model.h5'
URL_MODEL = 'https://github.com/fizyr/keras-retinanet/releases/download/0.5.1/resnet50_coco_best_v2.1.0.h5'
urllib.request.urlretrieve(URL_MODEL, PRETRAINED_MODEL)
print('Downloaded pretrained model to ' + PRETRAINED_MODEL)

os.system("!keras_retinanet/bin/train.py \
 --freeze-backbone \
 --random-transform \
 --weights {PRETRAINED_MODEL} \
 --batch-size 8 \
 --steps 500 \
 --epochs 10 \
 csv annotations.csv classes.csv")

model_path = os.path.join(
    'snapshots',
    sorted(os.listdir('snapshots'), reverse=True)[0]
)

model = tf.keras.models.load_model(model_path, backbone_name='resnet50')
model = tf.keras.models.convert_model(model)

labels_to_names = pd.read_csv(
  CLASSES_FILE,
  header=None
).T.loc[0].to_dict()

def predict(image):
  image = preprocess_image(image.copy())
  image, scale = resize_image(image)
  boxes, scores, labels = model.predict_on_batch(
    np.expand_dims(image, axis=0)
  )
  boxes /= scale
  return boxes, scores, labels

THRES_SCORE = 0.6
def draw_detections(image, boxes, scores, labels):
  for box, score, label in zip(boxes[0], scores[0], labels[0]):
    if score < THRES_SCORE:
        break
    color = label_color(label)
    b = box.astype(int)
    draw_box(image, b, color=color)
    caption = "{} {:.3f}".format(labels_to_names[label], score)
    draw_caption(image, b, caption)

def show_detected_objects(image_row):
  img_path = image_row.image_name
  image = read_image_bgr(img_path)
  boxes, scores, labels = predict(image)
  draw = image.copy()
  draw = cv2.cvtColor(draw, cv2.COLOR_BGR2RGB)
  true_box = [
    image_row.x_min, image_row.y_min, image_row.x_max, image_row.y_max
  ]
  draw_box(draw, true_box, color=(255, 255, 0))
  draw_detections(draw, boxes, scores, labels)
  plt.axis('off')
  plt.imshow(draw)
  plt.show()

