import os
from pathlib import Path

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

from src.prediction import character_prediction
from src.db import add_prediction, get_sql_stats


app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / "credentials" / ".env"

load_dotenv(ENV_PATH)

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

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/query", methods=["POST"])
def query():
    sql_file = request.get_json().get("sql_file")
    sql_limit = request.get_json().get("sql_limit")
    sql_offset = request.get_json().get("sql_offset")
    sortBy = request.get_json().get("sort")
    ascDesc = request.get_json().get("asc")
    cols, rows = get_sql_stats(sql_file, sql_limit, sql_offset, sortBy, ascDesc)

    return jsonify({
        "received": len(rows),
        "cols": cols,
        "rows": rows
    })

if __name__ == "__main__":
    # port = int(os.environ.get("PORT", 10000))
    # app.run(host="0.0.0.0", port=port)
    app.run(host="0.0.0.0", port=5000, debug=True)