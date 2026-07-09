// Functions for initializing canvas and drawing

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let confirmationPending = false;

// Canvas must be white (affects prediction performance)
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Ink settings (affects prediction performance)
ctx.strokeStyle = "black";
ctx.lineWidth = 36;
ctx.lineCap = "round";

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

export function setupCanvas() {
    // Mousedown will draw if there is no confirmation pending
    canvas.addEventListener("mousedown", () => {
        if (!confirmationPending) {
            drawing = true;
        }
    });

    canvas.addEventListener("mouseup", () => {
        drawing = false;
        ctx.beginPath();
    });

    canvas.addEventListener("mousemove", draw);
}

// Returns a b64 data URL
export function getCanvasImage() {
    return canvas.toDataURL("image/png");
}

export function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Updates confirmationPending boolean to enable/disable drawing
// This stops users from drawing on the canvas when they are giving feedback
export function setConfirmationPending(value) {
    confirmationPending = value;
}

export { canvas };