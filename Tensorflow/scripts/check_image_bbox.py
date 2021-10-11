import os
import numpy as np # linear algebra
import pandas as pd 
import seaborn as sns
import matplotlib.pyplot as plt

from PIL import Image, ImageDraw
import xml.etree.ElementTree as ET
import cv2


dataset_path = os.walk('/media/nardiena/7C1247391246F7A2/Documents/programming-projects/food-datasets/actual-dataset')
path = '/media/nardiena/7C1247391246F7A2/Documents/programming-projects/food-datasets/actual-dataset'

skip_first = True
for root, directories, files in dataset_path:
    if skip_first:
        skip_first = False
        continue

    class_label = os.path.basename(root)

    fileArr = []
    for content_name in files:
        file_name, file_extension = os.path.splitext(content_name)
        image_path = os.path.join(path, class_label, content_name)

        if file_extension == ".jpg":
            # image = cv2.imread(image_path)
            # cv2.imshow(file_name, image)

            # cv2.waitKey(0)

            # print("-------start--------")
            # print(root)
            # print(file_name)
            # print("==============")
            xml_path = os.path.join(root, file_name + '.xml')

            tree = ET.parse(xml_path)
            root_annotation = tree.getroot()

            sample_annotations = []
            for neighbor in root_annotation.iter('bndbox'):
                xmin = int(neighbor.find('xmin').text)
                ymin = int(neighbor.find('ymin').text)
                xmax = int(neighbor.find('xmax').text)
                ymax = int(neighbor.find('ymax').text)
                
                # print(xmin, ymin, xmax, ymax)
                sample_annotations.append([xmin, ymin, xmax, ymax])
                
            print(sample_annotations)

            image_path_opened = Image.open(image_path)
            sample_image_annotated = image_path_opened.copy()

            img_bbox = ImageDraw.Draw(sample_image_annotated)

            for bbox in sample_annotations:
                print(bbox)
                img_bbox.rectangle(bbox, outline="green") 
                
            
            sample_image_annotated.show()
    break

        
     