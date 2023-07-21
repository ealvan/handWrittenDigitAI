from keras.models import load_model
import tkinter as tk
from tkinter import *
import win32gui
from PIL import ImageGrab, Image
import numpy as np
import cv2
model = load_model('mnist.h5')

def predict_digit(img):
    #resize image to 28x28 pixels
    img = cv2.resize(img, (28,28), interpolation=cv2.INTER_CUBIC)
    # img = img.resize((28,28))
    #convert rgb to grayscale
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = np.array(img)
    img = np.invert(img)
    #reshaping for model normalization
    img = img.reshape(1,28,28,1)
    img = img/255.0
    #predicting the class
    res = model.predict([img])
    return np.argmax(res)

img = cv2.imread('digit3.png')
a = predict_digit(img)
print("The number probably is a:",a)

