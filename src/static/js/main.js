import {
    setupCanvas,
    clearCanvas as clearCanvasDrawing,
    getCanvasImage,
    setConfirmationPending
} from "./canvas.js";

import { requestPrediction } from "./dbApi.js";

import {
    setResult,
    correct,
    confirmCorrect,
    incorrect,
    submitFeedback,
    cancel,
    resetFeedback
} from "./feedback.js";

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

async function predict() {
    const imageData = getCanvasImage();

    const result = await requestPrediction(imageData);

    setResult(result);

    document.getElementById("prediction").innerText = `Prediction: ${result.prediction} with ${(result.confidence * 100).toFixed(2)}% confidence`;

    resetFeedback();
    document.getElementById("feedback").removeAttribute("hidden");
    setConfirmationPending(true);
}

function clearCanvas() {
    clearCanvasDrawing();

    document.getElementById("prediction").innerText = "Draw something and click Submit";

    resetFeedback();
    document.getElementById("submitted").setAttribute("hidden", "");
    setConfirmationPending(false);
}