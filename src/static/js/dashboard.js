import { query_stats } from "./dbApi.js";

const accuracyButton = document.getElementById("accuracy-button");
const confusionButton = document.getElementById("confusion-button");
const modelsButton = document.getElementById("models-button");

const sortDropdowns = document.getElementById("sort-dropdowns");
const sortBy = document.getElementById("sort-by");
const ascDesc = document.getElementById("asc-desc");

const characterOption = new Option("Character", "Character");
const numCorrectOption = new Option("Number Correct", "Number Correct");
const totalOption = new Option("Total", "Total");
const accuracyOption = new Option("Accuracy", "Accuracy");
const predictionOption = new Option("Prediction", "Prediction");
const countOption = new Option("Count", "Count");
const timeOption = new Option("Created At", "Created At");

const resetButton = document.getElementById("reset-button");

const tableDiv = document.getElementById("table");
const displayText = document.getElementById("display");

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

accuracyButton.addEventListener("click", accuracy);
confusionButton.addEventListener("click", confusion);
modelsButton.addEventListener("click", models);

sortBy.addEventListener("change", analytics);
ascDesc.addEventListener("change", analytics);

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
            if (mode == "accuracy" && j == 3) {
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
        const allResults = await query_stats(mode, 1000, 0, "\""+sortBy.value+"\"", ascDesc.value);
        max = allResults.received;
    }
    const result = await query_stats(mode, 10, page*10, "\""+sortBy.value+"\"", ascDesc.value);
    console.log(mode, result.cols, result.rows);
    let { table, displayEnd } = generateTable(result.cols, result.rows);
    displayText.innerText = `Displaying page ${page+1}: ${page*10+1}-${page*10+displayEnd} of ${max} rows`;
    displayVisibility();
    tableDiv.innerHTML = table;
}

function accuracy() {
    reset();
    mode = "accuracy";
    sortBy.add(characterOption);
    sortBy.add(numCorrectOption);
    sortBy.add(totalOption);
    sortBy.add(accuracyOption);
    sortBy.value = "Accuracy";
    ascDesc.value = "ASC";
    analytics();
}

function confusion() {
    reset();
    mode = "confusion";
    sortBy.add(characterOption);
    sortBy.add(predictionOption);
    sortBy.add(countOption);
    sortBy.value = "Count";
    ascDesc.value = "DESC";
    analytics();
}

function models() {
    reset();
    mode = "models";
    sortBy.add(timeOption);
    sortBy.value = "Created At";
    ascDesc.value = "DESC";
    analytics();
}

function displayVisibility() {
    sortDropdowns.removeAttribute("hidden");
    prevButton.removeAttribute("hidden");
    nextButton.removeAttribute("hidden");
    resetButton.removeAttribute("hidden");
}

function reset() {
    mode = null;
    page = 0;
    max = 0;
    sortDropdowns.setAttribute("hidden", "");
    sortBy.length = 0;
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