import os
from google.protobuf import text_format

# (Change accordingly) The directory that stored all the folders 
rootdir = '/media/nardiena/7C1247391246F7A2/Documents/programming-projects/food-datasets/UECFOOD256'

# number = 0
# label_name = {}

# # Loop through the directory
# for subdir, dirs, files in os.walk(rootdir):
#     # Skip the first subdirectory as it takes the current path and not the subdir
#     if number == 0:
#         number += 1
#         continue

#     # Make the dictionary 
#     label = os.path.basename(subdir)
    
#     label_name[label] = number
#     number += 1

# print(label_name)


IMAGE_ID_DICT = dict()
category_path = os.path.join(rootdir, 'category.txt')

with open(category_path, 'r') as dataset256Categories:
    # Read and print the entire file line by line
    i = 0
    for line in dataset256Categories:
        if i == 0:
            pass
        else:
            # if i == 5:
            #     break
            
            words = line.split()
            # print(words[0], "----", " ".join(words[1::]))

            IMAGE_ID_DICT[words[0]] = "_".join(words[1::])

        i += 1

    print(IMAGE_ID_DICT)

# Write the dictionary into a file so that it can be accessed later
with open('label_name.pbtxt', 'w') as f:
    for (k, v) in IMAGE_ID_DICT.items():
        item = ("item {\n"
                "\tname: '" + v + "'\n"
                "\tid: " + str(k) + "\n"
                "}\n\n")
        f.write(item)