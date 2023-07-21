import os
import tensorflow as tf
import cv2
import numpy as np
import matplotlib.pyplot as plt

model = tf.keras.models.load_model("models/handwritten.keras")
def dilate(img,kernel,iterations=1):
    kernel = np.ones(kernel, np.uint8)
    dilated_img = cv2.dilate(img, kernel, iterations=iterations)
    return dilated_img
i=0
while os.path.isfile(f"imgs/dd{i}.png"):
    try:
        img = cv2.imread(f"imgs/dd{i}.png")
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = dilate(img,(2,2),1)
        img = cv2.resize(img, (28,28), interpolation=cv2.INTER_CUBIC)
        img = np.array([img])        
        plt.imshow(img[0],cmap='gray')
        plt.show()

        prediction = model.predict(img)
        print("The number is probably a: ",np.argmax(prediction))        
    except:
        print("Error!")
    finally:
        i+=1

