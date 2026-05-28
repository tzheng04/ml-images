const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let confirmationPending = false;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

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

export function getCanvasImage() {
    return canvas.toDataURL("image/png");
}

export function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function setConfirmationPending(value) {
    confirmationPending = value;
}

export { canvas };