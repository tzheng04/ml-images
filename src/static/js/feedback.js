import { getCanvasImage } from "./canvas.js";
import { sendToDB } from "./dbApi.js";

let result = null;

export function setResult(newResult) {
    result = newResult;
}

export function correct() {
    document.getElementById("confirmCorrect-button").removeAttribute("hidden");
    document.getElementById("correct-button").setAttribute("hidden", "");
}

export function confirmCorrect() {
    document.getElementById("submitted").removeAttribute("hidden");
    document.getElementById("feedback").setAttribute("hidden", "");

    document.getElementById("correct-button").removeAttribute("hidden");
    document.getElementById("confirmCorrect-button").setAttribute("hidden", "");

    const imageData = getCanvasImage();
    sendToDB(result.prediction, result.prediction, imageData, true);
}

export function incorrect() {
    document.getElementById("incorrect").removeAttribute("hidden");
    document.getElementById("feedback").setAttribute("hidden", "");
}

export function submitFeedback() {
    let character = document.getElementById("char").value;

    const regex = /^[0-9A-Za-z]$/;

    if (!regex.test(character)) {
        alert("Please enter a single valid character matching ^[0-9A-Za-z]$");
    } else {
        resetFeedback();
        document.getElementById("submitted").removeAttribute("hidden");

        const imageData = getCanvasImage();
        sendToDB(character, result.prediction, imageData, false);
    }
}

export function cancel() {
    resetFeedback();
    document.getElementById("feedback").removeAttribute("hidden");
}

export function resetFeedback() {
    document.getElementById("char").value = "";
    document.getElementById("feedback").setAttribute("hidden", "");
    document.getElementById("incorrect").setAttribute("hidden", "");
    document.getElementById("submitted").setAttribute("hidden", "");

    document.getElementById("correct-button").removeAttribute("hidden");
    document.getElementById("confirmCorrect-button").setAttribute("hidden", "");
}