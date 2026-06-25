from app import app

def test_routes():
    client = app.test_client()

    response = client.get("/")

    assert response.status_code == 200

def test_accuracy():
    client = app.test_client()

    response = client.post(
        "/query",
        json={
            "sql_file": "accuracy",
            "sql_limit": "10",
            "sql_offset": "0",
            "sort": "\"Accuracy\"",
            "asc": "ASC",
        }
    )

    assert response.status_code == 200
    assert response.is_json

    data = response.get_json()

    assert "received" in data
    assert "cols" in data
    assert "rows" in data

def test_confusion():
    client = app.test_client()

    response = client.post(
        "/query",
        json={
            "sql_file": "confusion",
            "sql_limit": "10",
            "sql_offset": "0",
            "sort": "\"Count\"",
            "asc": "DESC",
        }
    )

    assert response.status_code == 200
    assert response.is_json

    data = response.get_json()

    assert "received" in data
    assert "cols" in data
    assert "rows" in data

def test_models():
    client = app.test_client()

    response = client.post(
        "/query",
        json={
            "sql_file": "models",
            "sql_limit": "10",
            "sql_offset": "0",
            "sort": "\"Created At\"",
            "asc": "DESC",
        }
    )

    assert response.status_code == 200
    assert response.is_json

    data = response.get_json()

    assert "received" in data
    assert "cols" in data
    assert "rows" in data