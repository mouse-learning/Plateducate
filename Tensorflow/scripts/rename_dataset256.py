import os 
import shutil 


# assign directory
dataset_path = os.walk('/media/nardiena/7C1247391246F7A2/Documents/programming-projects/food-datasets/UECFOOD256')
IMAGE_ID_DICT = dict()
IMAGE_ID_DICT_NAME = dict()
dataset_path_wo_walk = '/media/nardiena/7C1247391246F7A2/Documents/programming-projects/food-datasets/UECFOOD256'

category_path = os.path.join(dataset_path_wo_walk, 'category.txt')

with open(category_path, 'r') as dataset256Categories:
    # Read and print the entire file line by line
    i = 0
    for line in dataset256Categories:
        if i == 0:
            pass
        else:
            words = line.split()
            IMAGE_ID_DICT[words[0]] = "_".join(words[1::])
            IMAGE_ID_DICT_NAME["_".join(words[1::])] = words[0]

        i += 1

    # print(IMAGE_ID_DICT_NAME)


## ==========================================================================================================================================================================
## Rename the directories
# for root, directories, files in dataset_path:   
#     for directory in directories:
#         print(directory)
#         if directory.isnumeric() and directory in IMAGE_ID_DICT.keys():
#             path1 = os.path.join('/media/nardiena/7C1247391246F7A2/Documents/programming-projects/food-datasets/UECFOOD256', directory)
#             path2 = os.path.join('/media/nardiena/7C1247391246F7A2/Documents/programming-projects/food-datasets/UECFOOD256', IMAGE_ID_DICT[directory])
#             os.rename(path1, path2)





## ============================================================================================================================================================================
## ============================================================================================================================================================================
## Rename the images
number = 0
for root, directories, files in dataset_path:
    ## First iteration the UECFOOD256 path, [apple_pie, ayam_bakar, ...], [README.txt, category.txt] (we need to skip this)
    ## Second iteration apple_pie path, [], [*.jpeg, bb_info.txt]
    if number == 0:
        number += 1
        continue

    for image in files:
        class_label = os.path.basename(root)

        image_name, _ = os.path.splitext(image) 

        print("-------------RENAMING--------------------------------------\n", image, "to ", class_label+image, "\n")
        if class_label in IMAGE_ID_DICT.values() and image_name.isnumeric():
            # /media/nardiena/7C1247391246F7A2/Documents/programming-projects/food-datasets/UECFOOD256/nachos/102833.jpg
            path1 = os.path.join(root, image)

            # /media/nardiena/7C1247391246F7A2/Documents/programming-projects/food-datasets/UECFOOD256/nachos/nachos1.jpg
            path2 = os.path.join(root, class_label + image)

            os.rename(path1, path2)
            print("RENAMED: ", image, "to ", class_label + image, "\n")
        