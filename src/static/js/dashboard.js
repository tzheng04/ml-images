import { query } from "./dbApi";

const accuracyButton = document.getElementById("accuracy-button");
const confusionButton = document.getElementById("confusion-button");
const resetButton = document.getElementById("reset-button");
const tableDiv = document.getElementById("table")

accuracyButton.addEventListener("click", accuracy);
confusionButton.addEventListener("click", confusion);
resetButton.addEventListener("click", reset);

function generateTable(cols, rows) {
    let html = "<table><tr>";
    for (i = 0; i < cols.length(); i++) {
        html += `<th>${cols[i]}<\\th>`;
    }
    html += "<\\tr>";
    for (i = 0; i < ((10 <= rows.length()) ? 10 : rows.length()); i++) {
        html += "<tr>";
        for (j = 0; j < rows[i].length(); i++) {
            html += `<td>${rows[i][i]}<\\td>`;
        }
        html += "<\\tr>";
    }
    html += "<\\table>";
}

function accuracy() {
    let cols, rows = query("accuracy");
    let table = generateTable(cols, rows);
    
    tableDiv.innerHtml = table;
}

function confusion() {
    let cols, rows = query("confusion");
    let table = generateTable(cols, rows);
    
    tableDiv.innerHtml = table;
}

function reset() {
    tableDiv.innerHtml = "<div></div>";
}
