import { query } from "./dbApi.js";

const accuracyButton = document.getElementById("accuracy-button");
const confusionButton = document.getElementById("confusion-button");
const resetButton = document.getElementById("reset-button");
const tableDiv = document.getElementById("table")

accuracyButton.addEventListener("click", accuracy);
confusionButton.addEventListener("click", confusion);
resetButton.addEventListener("click", reset);

function generateTable(cols, rows) {
    let html = "<table><tr>";
    for (let i = 0; i < cols.length; i++) {
        html += `<th>${cols[i]}</th>`;
    }
    html += "</tr>";
    for (let i = 0; i < ((10 <= rows.length) ? 10 : rows.length); i++) {
        html += "<tr>";
        for (let j = 0; j < rows[i].length; j++) {
            html += `<td>${rows[i][j]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";

    return html
}

async function accuracy() {
    const result = await query("accuracy");
    console.log(result.cols)
    console.log(result.rows)
    let table = generateTable(result.cols, result.rows);
    
    tableDiv.innerHTML = table;
}

async function confusion() {
    const result = await query("confusion");
    let table = generateTable(result.cols, result.rows);
    
    tableDiv.innerHTML = table;
}

function reset() {
    tableDiv.innerHTML = "<div></div>";
}
