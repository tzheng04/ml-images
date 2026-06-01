import tensorflow as tf
import numpy as np
from PIL import Image
import base64
import io

model = tf.keras.models.load_model("./models/char_cnn_feedback.keras")

classes = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y', 'Z', 
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z'
]

def preprocess_img(input):
    input = input.split(",")[1]
    bytes = base64.b64decode(input)

    img = Image.open(io.BytesIO(bytes))

    img = img.resize((64, 64))
    img = img.convert("L")

    img_arr = np.array(img)
    img_arr = img_arr / 255.0

    img_arr = np.expand_dims(img_arr, axis=-1)
    img_arr = np.expand_dims(img_arr, axis=0)

    return img_arr

def character_prediction(image):
    processed = preprocess_img(image)

    prediction = model.predict(processed)[0]

    class_predictions = np.argmax(prediction)

    res = classes[class_predictions]
    conf = float(prediction[class_predictions])

    return res, conf


