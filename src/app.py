from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import base64
import io

app = Flask(__name__)

model = tf.keras.models.load_model("./models/char_cnn.keras")

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

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input = data["image"]

    predict = model.predict(preprocess_img(input))[0]

    pred_class = np.argmax(predict)
    conf = float(predict[pred_class])

    res = classes[pred_class]
    return jsonify({
        "prediction": res,
        "confidence": conf
    })

if __name__ == "__main__":
    app.run()