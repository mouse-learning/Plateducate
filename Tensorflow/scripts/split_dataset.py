from genericpath import isfile
import os
import random
import shutil

# TODO: 

# 1. For every class folder, ignore .txt.

dataset_path = os.walk('/media/nardiena/7C1247391246F7A22/Documents/programming-projects/plateducate-with-datasets/food-datasets/UECFOOD100')
TRAINING_PATH = '/media/nardiena/7C1247391246F7A22/Documents/programming-projects/plateducate-with-datasets/food-datasets/actual-dataset-100/training'
VALIDATION_PATH = '/media/nardiena/7C1247391246F7A22/Documents/programming-projects/plateducate-with-datasets/food-datasets/actual-dataset-100/validation'
TEST_PATH = '/media/nardiena/7C1247391246F7A22/Documents/programming-projects/plateducate-with-datasets/food-datasets/actual-dataset-100/test'
TRAINING_PERCENTAGE = 0.8
random.seed(11)

skip_first = True
for root, directories, files in dataset_path:
    if skip_first:
        skip_first = False
        continue
    
    class_label = os.path.basename(root)
    print("Performing split for {}".format(class_label))

    fileArr = []
    for content_name in files:
        file_name, file_extension = os.path.splitext(content_name)
        if file_extension == ".jpg":

            # 2. We split the class's contents by 80:20 for training:validation. We do it in pairs (xxx.jpg, xxx.xml)
            # 2a. Take the name of the file and put in list (unique file names). ['abc', 'def']
            if file_name not in fileArr:
                fileArr.append(file_name)     
    
    # Make sure number of jpg-xml pairs == number of unique file names
    assert (len(files)-1)//2 == len(fileArr)

    # 2b. Find the length of array of unique names. Multiply it by 80/100 (80%) -> num_of_training_data
    # The +1 is hardcoded for this SPECIFIC dataset.
    num_of_training = round(TRAINING_PERCENTAGE * len(fileArr))
    num_of_validation = round((1-TRAINING_PERCENTAGE) * len(fileArr)//2)
    num_of_test = len(fileArr) - num_of_training - num_of_validation

    # 3. Based on num_of_training_data (=8), take num_of_training_data (8) files from the trainingfolder randomly. The rest put into val folder.
    
    # 3a. Shuffle contents of file names
    # print("Prior to shuffling...\n", fileArr)
    random.shuffle(fileArr)
    # print("After shuffling...\n", fileArr)

    # 3b. Pop file names
    assert num_of_training < len(fileArr)
    assert num_of_validation < len(fileArr)
    assert num_of_test < len(fileArr)
    assert num_of_training + num_of_validation + num_of_test == len(fileArr)

    for _ in range(num_of_training):
        popped_file_name = fileArr.pop()
        
        old_path_jpg = os.path.join(root, popped_file_name + '.jpg')
        old_path_xml = os.path.join(root, popped_file_name + '.xml')

        new_path_jpg = os.path.join(TRAINING_PATH, popped_file_name + '.jpg')
        new_path_xml = os.path.join(TRAINING_PATH, popped_file_name + '.xml')
        
        # 3c. Copy popped_file_name.jpg and popped_file_name.xml to training folder.
        if not os.path.isfile(new_path_jpg) and not os.path.isfile(new_path_xml):
            shutil.copy(old_path_jpg, TRAINING_PATH)        # This is for .jpg
            shutil.copy(old_path_xml, TRAINING_PATH)        # This is for .xml

    assert num_of_validation + num_of_test == len(fileArr) 

    for _ in range(num_of_validation):
        popped_file_name = fileArr.pop()
        
        old_path_jpg = os.path.join(root, popped_file_name + '.jpg')
        old_path_xml = os.path.join(root, popped_file_name + '.xml')

        new_path_jpg_train = os.path.join(TRAINING_PATH, popped_file_name + '.jpg')
        new_path_xml_train = os.path.join(TRAINING_PATH, popped_file_name + '.xml')

        new_path_jpg = os.path.join(VALIDATION_PATH, popped_file_name + '.jpg')
        new_path_xml = os.path.join(VALIDATION_PATH, popped_file_name + '.xml')

        # 3c. Copy popped_file_name.jpg and popped_file_name.xml to training folder.
        if not (os.path.isfile(new_path_jpg_train) or os.path.isfile(new_path_xml_train) or
            os.path.isfile(new_path_jpg) or os.path.isfile(new_path_xml)):

            shutil.copy(old_path_jpg, VALIDATION_PATH)        # This is for .jpg
            shutil.copy(old_path_xml, VALIDATION_PATH)        # This is for .xml

    for _ in range(num_of_test):
        popped_file_name = fileArr.pop()
        
        old_path_jpg = os.path.join(root, popped_file_name + '.jpg')
        old_path_xml = os.path.join(root, popped_file_name + '.xml')

        new_path_jpg_train = os.path.join(TRAINING_PATH, popped_file_name + '.jpg')
        new_path_xml_train = os.path.join(TRAINING_PATH, popped_file_name + '.xml')

        new_path_jpg_validation = os.path.join(VALIDATION_PATH, popped_file_name + '.jpg')
        new_path_xml_validation = os.path.join(VALIDATION_PATH, popped_file_name + '.xml')

        new_path_jpg = os.path.join(TEST_PATH, popped_file_name + '.jpg')
        new_path_xml = os.path.join(TEST_PATH, popped_file_name + '.xml')

        # 3c. Copy popped_file_name.jpg and popped_file_name.xml to training folder.
        if not (os.path.isfile(new_path_jpg_train) or os.path.isfile(new_path_xml_train) or
            os.path.isfile(new_path_jpg_validation) or os.path.isfile(new_path_xml_validation) or
            os.path.isfile(new_path_jpg) or os.path.isfile(new_path_xml)):

            shutil.copy(old_path_jpg, TEST_PATH)        # This is for .jpg
            shutil.copy(old_path_xml, TEST_PATH)        # This is for .xml
