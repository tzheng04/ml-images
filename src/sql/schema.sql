CREATE TABLE models (
    id SERIAL PRIMARY KEY,
    version_name TEXT NOT NULL,
    model_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    true_label TEXT,
    predicted_label TEXT NOT NULL,
    image_b64 TEXT,
    was_correct BOOLEAN,
    confidence FLOAT,
    model_id INTEGER REFERENCES models(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);