import os
import psycopg
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / "credentials" / ".env"
SQL_DIR = BASE_DIR / "sql"

load_dotenv(ENV_PATH)
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
        
def get_sql_stats(sql_file, limit, offset, sortBy, ascDesc):
    fp = SQL_DIR / f"{sql_file}.sql"

    order_by = f"""
        ORDER BY {sortBy} {ascDesc},
        "Created At" DESC
    """

    if (sql_file == "accuracy"):
        order_by = f"""
        ORDER BY {sortBy} {ascDesc}, 
            "Accuracy" ASC, 
            "Character" ASC
        """
    elif (sql_file == "confusion"):
        order_by = f"""
        ORDER BY {sortBy} {ascDesc}, 
            "Count" DESC, 
            "Character" ASC
        """
    
    with open(fp, "r") as file:
        query = file.read()
        query = query.replace("-- ORDER BY", order_by)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (limit, offset))
            col_names = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            return col_names, rows