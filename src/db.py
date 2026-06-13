import os
import psycopg
from dotenv import load_dotenv

load_dotenv("./credentials/.env")
db_url = os.getenv("DATABASE_URL")

def get_connection():
    return psycopg.connect(db_url)

def add_model_version(version_name, model_path, notes=None):
    query = """
        INSERT INTO models (version_name, model_path, notes)
        VALUES (%s, %s, %s)
        RETURNING id;
    """

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (version_name, model_path, notes))
            model_id = cur.fetchone()[0]
            return model_id
        
def add_prediction(true_label, predicted_label, image_b64, was_correct, confidence, version_name):
    query = """
        INSERT INTO predictions (
            true_label, 
            predicted_label, 
            image_b64, 
            was_correct, 
            confidence, 
            model_id
        )
        VALUES (
            %s, %s, %s, %s, %s, 
            (SELECT id FROM models WHERE version_name = %s)
        )
        RETURNING id;
    """

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (true_label, predicted_label, image_b64, was_correct, confidence, version_name))
            prediction_id = cur.fetchone()[0]
            return prediction_id