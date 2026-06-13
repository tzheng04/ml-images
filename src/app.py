from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
from prediction import character_prediction
from db import add_prediction
app = Flask(__name__)

load_dotenv("./credentials/.env")


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input = data["image"]

    res, conf, model_name = character_prediction(input)

    return jsonify({
        "prediction": res,
        "confidence": conf,
        "model_name": model_name
    })

@app.route("/submit", methods=["POST"])
def updateDB():
    data = request.get_json()

    true = data.get("true_label")
    pred = data.get("predicted_label")

    correct = data.get("was_correct")
    if (true == pred):
        correct = True
    print(data.get("model_name"))
    prediction_id = add_prediction(
        true_label=true, 
        predicted_label=pred, 
        image_b64=data.get("image"), 
        was_correct=correct, 
        confidence=data.get("confidence"), 
        version_name=data.get("model_name")
    )

    return jsonify({"prediction_id": prediction_id})

if __name__ == "__main__":
    # port = int(os.environ.get("PORT", 10000))
    # app.run(host="0.0.0.0", port=port)
    app.run(debug=True)