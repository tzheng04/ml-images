// Functions to handle feedback feature (correct or incorrect prediction)

import { getCanvasImage } from "./canvas.js";
import { sendToDB } from "./dbApi.js";

let result = null;

// Setter for 'result' global variable which will hold prediction fetched from API
export function setResult(newResult) {
    result = newResult;
}

// Called when answering "Correct"; replaces the button with a confirmation
export function correct() {
    document.getElementById("confirmCorrect-button").removeAttribute("hidden");
    document.getElementById("correct-button").setAttribute("hidden", "");
}

// Called when confirming that the prediction is correct
export function confirmCorrect() {
    document.getElementById("submitted").removeAttribute("hidden");
    document.getElementById("feedback").setAttribute("hidden", "");

    document.getElementById("correct-button").removeAttribute("hidden");
    document.getElementById("confirmCorrect-button").setAttribute("hidden", "");

    // INSERT into database
    const imageData = getCanvasImage();
    sendToDB(result.prediction, result.prediction, imageData, true, result.confidence, result.model_name);
}

// Called when answering "Incorrect"; prompts for true label
export function incorrect() {
    document.getElementById("incorrect").removeAttribute("hidden");
    document.getElementById("feedback").setAttribute("hidden", "");
}

// Called when clicking "Submit Feedback" and adds record into database
export function submitFeedback() {
    let character = document.getElementById("char").value;

    // Verifies response is valid by matching regex
    const regex = /^[0-9A-Za-z]$/;

    if (!regex.test(character)) {
        alert("Please enter a single valid character matching ^[0-9A-Za-z]$");
    } else {
        // Submit and add to database
        resetFeedback();
        document.getElementById("submitted").removeAttribute("hidden");

        const imageData = getCanvasImage();
        sendToDB(character, result.prediction, imageData, false, result.confidence, result.model_name);
    }
}

// Resets visibility when cancelling feedback response without clearing the canvas (i.e. the user clicked "Correct" but wants to undo and submit "Incorrect" for the same drawing)
export function cancel() {
    resetFeedback();
    document.getElementById("feedback").removeAttribute("hidden");
}

// Resets visibility after clearing the canvas or submitting feedback
export function resetFeedback() {
    document.getElementById("char").value = "";
    document.getElementById("feedback").setAttribute("hidden", "");
    document.getElementById("incorrect").setAttribute("hidden", "");
    document.getElementById("submitted").setAttribute("hidden", "");

    document.getElementById("correct-button").removeAttribute("hidden");
    document.getElementById("confirmCorrect-button").setAttribute("hidden", "");
}