import base64
import io
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

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

def character_prediction(model_name, image):
    processed = preprocess_img(image)
    model = tf.keras.models.load_model(MODEL_DIR / f"{model_name}.keras")

    prediction = model.predict(processed)[0]

    class_predictions = np.argmax(prediction)

    res = classes[class_predictions]
    conf = float(prediction[class_predictions])
    
    return res, conf


