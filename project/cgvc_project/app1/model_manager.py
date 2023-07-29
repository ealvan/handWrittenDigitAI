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
    def thresholding(img,threshold_value):
        _, thresholded_image = cv2.threshold(image, threshold_value, 255, cv2.THRESH_BINARY)
        return thresholded_image
    def adaptive_threshold_image(image):
        # Apply adaptive thresholding using cv2.adaptiveThreshold()
        thresholded_image = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)
        return thresholded_image

    def preprocess(img):
        desired_size = (28,28)
        img = cv2.resize(img, desired_size)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        saveImg(img,"1_gray_image.png")
        img = dilate(img,(1,1),4)
        saveImg(img,"2_gray_dilated.png")
        # img = thresholding(img,25)
        try:
            img = adaptive_threshold_image(img)
            saveImg(img,"3_threshold_image.png")
        except Exception as e:
            print("Error ocurrido en adaptive_threshold_image")
            print(e)
        img = cv2.bitwise_not(img)
        saveImg(img,"4_bitwise_not_img.png")
        # saveImg(img,'dilated_and_inverted_img.png')
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
