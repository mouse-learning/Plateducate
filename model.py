from tensorflow.keras import datasets
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Load dataset
(train_images, train_labels), (test_images, test_labels) = datasets.mnist.load_data()

# For training, we will use 10000 images
# And we will test our model on 1000 images
train_labels = train_labels[:10000]
test_labels = test_labels[:1000]

# Normalize
train_images = train_images[:10000].reshape(-1, 28 * 28) / 255.0
test_images = test_images[:1000].reshape(-1, 28 * 28) / 255.0

# Define the model
model = Sequential()
model.add(Dense(512, activation='relu', input_shape=(784,)))
model.add(Dense(10, activation='softmax'))