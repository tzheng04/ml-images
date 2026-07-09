// Database functions to work with Flask routes

// Sends POST request containing modelName and imageData from frontend to Flask
// Returns JSON with "prediction", "confidence", and "model_name"
export async function requestPrediction(modelName, imageData) {
    const response = await fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: modelName,
            image: imageData
        })
    });

    return await response.json();
}

// Updates PostgreSQL database, where
// truth: character (string)
// prediction: character (string)
// img: b64 data URL
// correct: boolean
// conf: float
// model_name: string
// Sends POST request with new record information to be INSERTed into database
// response.text() includes 'prediction_id'
export async function sendToDB(truth, prediction, img, correct, conf, model_name) {
    const response = await fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            true_label: truth,
            predicted_label: prediction,
            image: img,
            was_correct: correct,
            confidence: conf,
            model_name: model_name
        })
    });

    const text = await response.text();

    // Outputs to console for debugging
    console.log("Status:", response.status);
    console.log("Response:", text);
}

// Sends POST request with query type and parameters to Flask
// query_type: string ("accuracy", "confusion", "models")
// limit: int
// offset: int
// sortBy: string with quotes (example '"Created At"')
// ascDesc: "ASC" or "DESC" string
// model_id: id as a string (default "0")
// Returns JSON containing "received" (number of rows), "cols" (column names), "rows" (records fetched by query)
export async function query_stats(query_type, limit, offset, sortBy, ascDesc, model_id="0") {
    const response = await fetch("/query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sql_file: query_type,
            sql_limit: limit,
            sql_offset: offset,
            sort: sortBy,
            asc: ascDesc,
            model: model_id
        })
    });

    return await response.json();
}