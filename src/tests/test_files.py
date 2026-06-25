from pathlib import Path

# Simple test to verify .sql files are present and paths are correct"
def test_filenames():
    root_dir = Path(__file__).resolve().parent.parent
    sql_dir = root_dir / "sql"

    sql_files = {
        "schema.sql",
        "db_seed.sql",
        "accuracy.sql",
        "confusion.sql",
        "models.sql"
    }
    
    for file in sql_files:
        assert (sql_dir / file).exists(), f"Failed with missing file: {sql_dir / file}"

