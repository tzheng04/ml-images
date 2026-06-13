export async function requestPrediction(imageData) {
    const response = await fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            image: imageData
        })
    });

    return await response.json();
}

export async function sendToDB(truth, prediction, img, correct, conf) {
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
            confidence: conf
        })
    });

    const text = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", text);
}