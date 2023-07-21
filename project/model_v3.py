import cv2
import numpy as np
import matplotlib.pyplot as plt
import keras

model = keras.models.load_model("models/HandWrittenModel_v3.1.keras")
path = "imgs/"

# Assuming `new_image` is a grayscale image of a handwritten digit (28x28)
def dilate(img,kernel,iterations=1):
  kernel = np.ones(kernel, np.uint8)
  dilated_img = cv2.dilate(img, kernel, iterations=iterations)
  return dilated_img

def preprocess(img):
  desired_size = (28,28)
  img = cv2.resize(img, desired_size)
  img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
  img = dilate(img,(1,1),4)
  img = img.astype('float32') / 255.0
  return img

fig, axs = plt.subplots(3, 3, figsize=(10, 10))

files = [path+f"dd{i}.png" for i in range(0,10)]
pr_images = [preprocess(cv2.imread(f)) for f in files]
pr_images = [primg.reshape(1, 28, 28, 1) for primg in pr_images]

# names = map(lambda x: x.replace(path,''), files)
primg = iter(pr_images)
names = map(lambda x: x.replace(path,''), files)

for i in range(3):
  for j in range(3):
      current_img = next(primg)
      current_name = next(names)
      prediction = model.predict(current_img)
      label = np.argmax(prediction)
      axs[i, j].imshow(current_img[0])
      axs[i, j].set_title(f'Subplot {label}')

plt.show()