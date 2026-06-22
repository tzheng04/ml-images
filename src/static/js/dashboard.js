import { query_stats } from "./dbApi.js";

const accuracyButton = document.getElementById("accuracy-button");
const confusionButton = document.getElementById("confusion-button");
const resetButton = document.getElementById("reset-button");
const tableDiv = document.getElementById("table")
const displayText = document.getElementById("display")
const prevButton = document.getElementById("prev")
const nextButton = document.getElementById("next")

accuracyButton.addEventListener("click", accuracy);
confusionButton.addEventListener("click", confusion);
resetButton.addEventListener("click", reset);
prevButton.addEventListener("click", prev);
nextButton.addEventListener("click", next);

let mode = null;
let page = 0;
let max = 0;

function generateTable(cols, rows) {
    let displayEnd = ((10 <= rows.length) ? 10 : rows.length);
    let html = "<table><tr>";
    for (let i = 0; i < cols.length; i++) {
        html += `<th>${cols[i]}</th>`;
    }
    html += "</tr>";
    for (let i = 0; i < displayEnd; i++) {
        html += "<tr>";
        for (let j = 0; j < rows[i].length; j++) {
            if (j == 3) {
                html += `<td>${(rows[i][j]*100).toFixed(2)}%</td>`;
            } else {
                html += `<td>${rows[i][j]}</td>`
            }
        }
        html += "</tr>";
    }
    html += "</table>";
    return {
        table: html,
        displayEnd: displayEnd
    };
}

async function analytics() {
    if (max == 0) {
        const allResults = await query_stats(mode, 1000, 0);
        max = allResults.received;
    }
    const result = await query_stats(mode, 10, page*10);
    console.log(mode, result.cols, result.rows);
    let { table, displayEnd } = generateTable(result.cols, result.rows);
    displayText.innerText = `Displaying page ${page+1}: ${page*10+1}-${page*10+displayEnd} of ${max} rows`;
    displayVisibility();
    tableDiv.innerHTML = table;
}

function accuracy() {
    reset();
    mode = "accuracy";
    analytics();
}

function confusion() {
    reset();
    mode = "confusion";
    analytics();
}



function displayVisibility() {
    prevButton.removeAttribute("hidden");
    nextButton.removeAttribute("hidden");
    resetButton.removeAttribute("hidden");
}

function reset() {
    mode = null;
    page = 0;
    prevButton.setAttribute("hidden", "");
    nextButton.setAttribute("hidden", "");
    resetButton.setAttribute("hidden", "");
    display.innerText = "Select a button to display results"
    tableDiv.innerHTML = "";
}

function prev() {
    if (!mode) {
        return;
    } else if (page > 0) {
        page -= 1;
        analytics();
    }
}

function next() {
    if (!mode) {
        return;
    } else if (page*10+10 <= max) {
        page += 1;
        analytics();
    }
}