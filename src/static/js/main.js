import {
    setupCanvas,
    clearCanvas as clearCanvasDrawing,
    getCanvasImage,
    setConfirmationPending
} from "./canvas.js";

import { 
    requestPrediction,
    query_stats
 } from "./dbApi.js";

import {
    setResult,
    correct,
    confirmCorrect,
    incorrect,
    submitFeedback,
    cancel,
    resetFeedback
} from "./feedback.js";

const modelSelect = document.getElementById("model-select");
const clearCanvasButton = document.getElementById("clearCanvas-button");
const predictButton = document.getElementById("predict-button");
const correctButton = document.getElementById("correct-button");
const confirmCorrectButton = document.getElementById("confirmCorrect-button");
const incorrectButton = document.getElementById("incorrect-button");
const submitFeedbackButton = document.getElementById("submitFeedback-button");
const cancelButton = document.getElementById("cancel-button");

setupCanvas();

clearCanvasButton.addEventListener("click", clearCanvas);
predictButton.addEventListener("click", predict);
correctButton.addEventListener("click", correct);
confirmCorrectButton.addEventListener("click", confirmCorrect);
incorrectButton.addEventListener("click", incorrect);
submitFeedbackButton.addEventListener("click", submitFeedback);
cancelButton.addEventListener("click", cancel);

// Populates dropdown with available models when DOM loads
// Assumes <= 100 models available
window.addEventListener("DOMContentLoaded", async () => {
    const models = await query_stats("models", 100, 0, "\"Created At\"", "DESC");
    
    for (let i = 0; i < models.received; i++) {
        modelSelect.add(new Option(models.rows[i][0], models.rows[i][0]))
    }
});

// Called when user chooses "Predict", sends image to prediction API
async function predict() {
    const imageData = getCanvasImage();

    const result = await requestPrediction(modelSelect.value, imageData);

    setResult(result);

    document.getElementById("prediction").innerText = `Prediction: ${result.prediction} with ${(result.confidence * 100).toFixed(2)}% confidence`;

    resetFeedback();
    document.getElementById("feedback").removeAttribute("hidden");
    setConfirmationPending(true);
}

// Called when choosing "Clear", sets the canvas back to white and resets element visiblity
function clearCanvas() {
    clearCanvasDrawing();

    document.getElementById("prediction").innerText = "Draw a character and click the 'Predict' button.";

    resetFeedback();
    document.getElementById("submitted").setAttribute("hidden", "");
    setConfirmationPending(false);
}