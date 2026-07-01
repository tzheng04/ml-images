import base64
import io
from pathlib import Path

import numpy as np
import pandas as pd
from PIL import Image
from sklearn.model_selection import train_test_split

from src.db import get_connection

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

def get_samples():
    query = """
        SELECT id, true_label, image_b64
        FROM predictions
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

def decode_feedback(image_b64, id):
    try:
        if "," in image_b64:
            image_b64 = image_b64.split(",")[1]

        img_bytes = base64.b64decode(image_b64)
        img = Image.open(io.BytesIO(img_bytes))

        img.load()

        img = img.resize((64,64))

        return img

    except Exception as e:
        print(f"Skipped bad image with id {id}: {e}")
        return None


def load_training_data():
    # Make a list of all user-drawn images
    resized_img = []
    y = []
    skipped = 0

    feedback_data = get_samples()
    
    for row in feedback_data:
        img = decode_feedback(image_b64=row[2], id=row[0])

        if img is None:
            skipped += 1
            continue
    
        resized_img.append(img)
        y.append(row[1])

    # Add base dataset
    csv = pd.read_csv(DATA_DIR / "english.csv")
    paths = csv['image'].tolist()
    y.extend(csv['label'].tolist())

    # Resize and add base dataset images
    for image in paths:
        img = Image.open(DATA_DIR / f"{image}")
        img = img.resize((64, 64))
    
        resized_img.append(img)

    # Get the 62 classes
    classes = csv['label'].unique().tolist()

    # Convert class labels to integer
    conversion = {}

    cur = 0
    for label in classes:
        conversion[label] = cur
        cur += 1

    for i in range(len(y)):
        y[i] = conversion[f"{y[i]}"]

    # Preprocess and stack
    X = []

    for img in resized_img:
        img = img.convert("L")

        img_arr = np.array(img)
        img_arr = img_arr / 255.0

        img_arr = np.expand_dims(img_arr, axis=-1)

        X.append(img_arr)

    X = np.array(X, dtype="float32")
    y = np.array(y, dtype="int32")

    # Split data into training, validation, and test
    # First 80/20 split
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # 50/50 split of temp (20%) = 80/10/10 split for validation/test
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)
    
    info = {
        "base_samples": 3410,
        "feedback_samples": len(feedback_data) - skipped,
        "total": 3410 + len(X),
    }
    
    return X_train, X_val, X_test, y_train, y_val, y_test, info