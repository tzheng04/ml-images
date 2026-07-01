from datetime import datetime
import os
from pathlib import Path

import mlflow
import mlflow.keras

from src.training.data import load_training_data
from src.training.model import build_model
from src.db import add_model_version

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

def main():
    MODEL_DIR.mkdir(exist_ok=True)

    mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING", "http://mlflow:5000"))
    mlflow.set_experiment("handwritten-classifier")

    X_train, X_val, X_test, y_train, y_val, y_test, info = load_training_data()

    model = build_model()

    with mlflow.start_run(run_name="model-retrain") as run:
        run_id = run.info.run_id

        MODEL_PATH = MODEL_DIR / f"char_cnn_feedback_{run_id}.keras"

        mlflow.log_param("base_samples", info.get("base_samples"))
        mlflow.log_param("feedback_samples", info.get("feedback_samples"))
        mlflow.log_param("total", info.get("total"))

        history = model.fit(X_train, y_train, epochs=10, validation_data=(X_val, y_val))

        test_loss, test_acc = model.evaluate(X_test, y_test)

        mlflow.log_metric("test_loss", test_loss)
        mlflow.log_metric("test_acc", test_acc)

        for step, acc in enumerate(history.history.get("accuracy", [])):
            mlflow.log_metric("train_accuracy", acc, step=step)

        for step, val_acc in enumerate(history.history.get("val_accuracy", [])):
            mlflow.log_metric("val_accuracy", val_acc, step=step)

        model.save(MODEL_PATH)

        mlflow.log_artifact(str(MODEL_PATH), artifact_path="model")

        add_model_version(
            version_name=f"char_cnn_feedback_{run_id}",
            model_path=f"models/char_cnn_feedback_{run_id}.keras",
            notes=f"retrained with {info.get('feedback_samples')} user samples, achieving {test_acc*100:.2f}% test accuracy"
        )

if __name__ == "__main__":
    main()


