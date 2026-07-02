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

    console.log("Status:", response.status);
    console.log("Response:", text);
}

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