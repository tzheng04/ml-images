import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / "credentials" / ".env"
SQL_DIR = BASE_DIR / "sql"

load_dotenv(ENV_PATH)
db_url = os.getenv("DATABASE_URL")

def get_connection():
    return psycopg.connect(db_url)

# Add new model to the database
# version_name: string
# model_path: string
# notes: string
# Returns the model_id
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

# Add new prediction record
# true_label: string
# predicted_label: string
# image_b64: b64 data URL as string
# was_correct: boolean
# confidence: float
# version_name: string
# Returns prediction_id
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

# sql_file: string
# limit: int
# offset: int
# sortBy: "string"
# ascDesc: string
# model_id: string
def get_sql_stats(sql_file, limit, offset, sortBy, ascDesc, model_id):
    fp = SQL_DIR / f"{sql_file}.sql"

    # default order_by, used only for "models" query
    order_by = f"""
        ORDER BY 
            {sortBy} {ascDesc},
            "Created At" DESC
    """

    # keeps "-- WHERE" comment by default
    where = f"""
        -- WHERE
    """

    # Replaces default order_by for "accuracy" query
    if (sql_file == "accuracy"):
        order_by = f"""
            ORDER BY 
                {sortBy} {ascDesc}, 
                "Accuracy" ASC, 
                "Character" ASC
        """

        # Executes when a specific model is given and filters for that model only
        if (model_id != "0"):
            where = f"""
                WHERE model_id = {model_id}
            """

    # Replaces default order_by for "confusion" query
    elif (sql_file == "confusion"):
        order_by = f"""
            ORDER BY {sortBy} {ascDesc}, 
            "Count" DESC, 
            "Character" ASC
        """

        # Executes when a specific model is given and filters for that model only
        if (model_id != "0"):
            where = f"""
                WHERE model_id = {model_id} AND NOT was_correct
            """
        # Default WHERE case for "confusion" query
        else:
            where = f"""
                WHERE NOT was_correct
            """
    
    with open(fp, "r") as file:
        query = file.read()
        query = query.replace("-- ORDER BY", order_by)
        query = query.replace("-- WHERE", where)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (limit, offset))
            col_names = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            return col_names, rows