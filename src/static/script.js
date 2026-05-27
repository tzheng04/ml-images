const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = "black";
ctx.lineWidth = 36;
ctx.lineCap = "round";

canvas.addEventListener("mousedown", () => {
    drawing = true;
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.getElementById("prediction").innerText = "Draw something and click Submit";
    resetFeedback();
    document.getElementById("submitted").setAttribute("hidden", "");
}

async function predict() {
    const imageData = canvas.toDataURL("image/png");

    const response = await fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            image: imageData
        })
    });

    const result = await response.json();

    document.getElementById("prediction").innerText = `Prediction: ${result.prediction} with ${result.confidence}% confidence`;
    resetFeedback();
    document.getElementById("feedback").removeAttribute("hidden");
}

function correct() {
    document.getElementById("confirm").removeAttribute("hidden");
    document.getElementById("correct").setAttribute("hidden", "");
}

function confirmCorrect() {
    document.getElementById("submitted").removeAttribute("hidden");
    document.getElementById("feedback").setAttribute("hidden", "");

    document.getElementById("correct").removeAttribute("hidden");
    document.getElementById("confirm").setAttribute("hidden", "");
}

function incorrect() {
    document.getElementById("incorrect").removeAttribute("hidden");
    document.getElementById("feedback").setAttribute("hidden", "");
}

function submitFeedback() {
    let character = document.getElementById("char").value;
    const regex = /[0-9A-Za-z]{1,}/;
    if (!regex.test(character)) {
        alert("Please enter a single valid character matching [0-9A-Za-z]{1,}");
    } else {
        document.getElementById("submitted").removeAttribute("hidden");
    }
}

function cancel(){
    resetFeedback();
    document.getElementById("feedback").removeAttribute("hidden");
}

function resetFeedback() {
    document.getElementById("char").value = "";
    document.getElementById("feedback").setAttribute("hidden", "");
    document.getElementById("correct").setAttribute("hidden", "");
    document.getElementById("incorrect").setAttribute("hidden", "");
    document.getElementById("submitted").setAttribute("hidden", "");

    document.getElementById("correct").removeAttribute("hidden");
    document.getElementById("confirm").setAttribute("hidden", "");
}