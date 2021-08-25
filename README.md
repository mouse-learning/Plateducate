# mouselearning
Mobile Image Recognition Application

# mouselearning: Training a Pre-trained Tensorflow Model on the Food Dataset

## Dataset
The UECFOOD256 food dataset can be found on [kaggle](https://www.kaggle.com/rkuo2000/uecfood256).

## Data Pre-processing
The data has been pre-processed with the scripts in this [folder](https://github.com/mouse-learning/Plateducate/tree/ml/object-detection-ssd/Tensorflow/scripts) so that each JPG file contains the food class name and the id corresponding to its bounding box info.

1. Create label.pbtxt file using this [script](https://github.com/mouse-learning/Plateducate/blob/ml/object-detection-ssd/Tensorflow/scripts/label_name_create.py).
2. Rename class directories from their id to their class name, e.g. 1 -> 'abodos', and the .jpg files from their id to their class name and id, e.g. '123.jpg' -> 'nachos123.jpg' using this [script](https://github.com/mouse-learning/Plateducate/blob/ml/object-detection-ssd/Tensorflow/scripts/rename_dataset256.py).
3. Generate XML files for each JPG in each class directory using this [script](https://github.com/mouse-learning/Plateducate/blob/ml/object-detection-ssd/Tensorflow/scripts/convert_to_XML.py).
4. Split the data in each class directory into training and test data and copy to the training and test folders using this [script](https://github.com/mouse-learning/Plateducate/blob/ml/object-detection-ssd/Tensorflow/scripts/split_dataset.py).
5. Check whether the bounding boxes are correct using this [script](https://github.com/mouse-learning/Plateducate/blob/ml/object-detection-ssd/Tensorflow/scripts/split_dataset.py). Note: this script still has bugs so beware (can't stop showing image after running the script).

## Creating the Tensorflow Records
Run this [script](https://github.com/mouse-learning/Plateducate/blob/ml/object-detection-ssd/Tensorflow/scripts/generate_tfrecord.py) to generate the tensorflow records files for the training and test datasets.

Run the script in this format:
```
python generate_tfrecord.py -x "path-to-training-images-directory" -l "path-to-pbtxt-file" -o "output-path-to-training-record-file" -c "output-path-to-training-csv-file"
```
Do the same for the test dataset:
```
python generate_tfrecord.py -x "path-to-training-images-directory" -l "path-to-pbtxt-file" -o "path-to-test-record-file-output" -c "path-to-test-csv-file-output"
```
