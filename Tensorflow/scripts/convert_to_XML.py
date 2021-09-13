import os
from PIL import Image
from pascal_voc_writer import Writer

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

number = 0
for root, directories, files in dataset_path:
    ## First iteration the UECFOOD256 path, [apple_pie, ayam_bakar, ...], [README.txt, category.txt] (we need to skip this)
    ## Second iteration apple_pie path, [], [*.jpeg, bb_info.txt]
    if number == 0:
        number += 1
        continue
    
    class_label = os.path.basename(root)

    print("Renaming files in {}...".format(class_label))
    bb_txt_path = os.path.join(root, 'bb_info.txt')
    bb_text_dict = {}
    with open(bb_txt_path, 'r') as bb_txt:
        content = bb_txt.readlines()

        for content in content[1:]:
            content_arr = content.split(" ")                                # ['123232', '23', '2', '2', '2\n']
            content_arr[-1] = content_arr[-1][:-1]
            bb_text_dict[class_label + content_arr[0]] = content_arr[1::]   # content_arr[1::] = [23 2 2 2]

    for content_name in files:
        file_name, file_extension = os.path.splitext(content_name)
        if file_extension != ".jpg":
            continue

        img_path = os.path.join(root, content_name)
        xml_path = os.path.join(root, file_name + '.xml')

        # Check if XML file for image already exists and file extension is JPG. If yes, skip generating XML.
        if not os.path.isfile(xml_path):            
            img = Image.open(img_path)
            width, height = img.size

            writer = Writer(img_path, width, height)
            writer.addObject(class_label, bb_text_dict[file_name][0], bb_text_dict[file_name][1], 
                            bb_text_dict[file_name][2], bb_text_dict[file_name][3])
            writer.save(xml_path)

print("yatta")