from flask import Flask, render_template, request, jsonify
import numpy as np
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime, timezone
from prediction import character_prediction

app = Flask(__name__)

load_dotenv("./credentials/.env")
db_url = os.getenv("MONGO_CONNECTION_STRING")

client = MongoClient(db_url)
db = client["classifier"]
collection = db["feedback"]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input = data["image"]

    res, conf = character_prediction(input)

    return jsonify({
        "prediction": res,
        "confidence": conf
    })

@app.route("/submit", methods=["POST"])
def updateDB():
    data = request.get_json()

    entry = {
        "true_label": data.get("true_label"),
        "predicted_label": data.get("predicted_label"),
        "image_b64": data.get("image"),
        "was_correct": data.get("was_correct"),
        "time": datetime.now(timezone.utc)
    }

    result = collection.insert_one(entry)

    return jsonify({"id": str(result.inserted_id)})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
    # app.run(debug=True)