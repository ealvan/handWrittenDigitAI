from tensorflow.keras.models import load_model
from django.conf import settings
import os
import cv2
import numpy as np

# Initialize model as None
loaded_model = None

def load_my_model():
    global loaded_model
    if not loaded_model:
        # Load your machine learning model here
        # Replace 'path/to/your/model.h5' with the actual path to your model file
        path_model = os.path.join(settings.STATICFILES_DIRS[0],'models','HandWrittenModel_v3.1.keras')
        loaded_model = load_model(path_model)
    return loaded_model

def predict(image_data):
    model = load_my_model()
    # Perform prediction using the loaded model
    # For example:
    predictions = model.predict(image_data)
    return np.argmax(predictions)

def process_image(path_img):

    def dilate(img,kernel,iterations=1):
        kernel = np.ones(kernel, np.uint8)
        dilated_img = cv2.dilate(img, kernel, iterations=iterations)
        return dilated_img

    def preprocess(img):
        desired_size = (28,28)
        img = cv2.resize(img, desired_size)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = dilate(img,(1,1),4)
        img = cv2.bitwise_not(img)
        saveImg(img,'dilated_and_inverted_img.png')
        img = img.astype('float32') / 255.0
        return img

    def saveImg(img,name):
        save_path=os.path.join(settings.MEDIA_ROOT,name)
        cv2.imwrite(save_path, img)
    
    img = cv2.imread(path_img)
    img = preprocess(img)
    saveImg(img,'preprocessed_image.png')
    img = img.reshape(1, 28, 28, 1)

    return img
