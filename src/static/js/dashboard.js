// Main JavaScript file for the Dashboard page

import { query_stats } from "./dbApi.js";

const accuracyButton = document.getElementById("accuracy-button");
const confusionButton = document.getElementById("confusion-button");
const modelsButton = document.getElementById("models-button");

// sortDropdowns starts empty, Options are added based on query mode
const sortDropdowns = document.getElementById("sort-dropdowns");

// Options to add to sorting 'select' elements
const characterOption = new Option("Character", "Character");
const numCorrectOption = new Option("Number Correct", "Number Correct");
const totalOption = new Option("Total", "Total");
const accuracyOption = new Option("Accuracy", "Accuracy");
const predictionOption = new Option("Prediction", "Prediction");
const countOption = new Option("Count", "Count");
const timeOption = new Option("Created At", "Created At");

const modelSelect = document.getElementById("model-select");
const sortBy = document.getElementById("sort-by");
const ascDesc = document.getElementById("asc-desc");

const resetButton = document.getElementById("reset-button");

const tableDiv = document.getElementById("table");
const displayText = document.getElementById("display");

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

// Analytics buttons
accuracyButton.addEventListener("click", accuracy);
confusionButton.addEventListener("click", confusion);
modelsButton.addEventListener("click", models);

// Model selection and sorting dropdowns
modelSelect.addEventListener("change", modelChange);
sortBy.addEventListener("change", analytics);
ascDesc.addEventListener("change", analytics);

resetButton.addEventListener("click", reset);

// Navigation buttons to change page
prevButton.addEventListener("click", prev);
nextButton.addEventListener("click", next);

// Mode: null, "accuracy", "confusion", or "models"
// Determines which SQL query to use
let mode = null;
// Page >= 0: tracks which set of 10 rows to display (0-9, 10-19, ...)
let page = 0;
// Max >= 0: tracks how many total rows for the query
let max = 0;


// Populate modelSelect dropdown menu with the available models as soon as the DOM loads
window.addEventListener("DOMContentLoaded", async () => {
    const models = await query_stats("models", 100, 0, "\"Created At\"", "DESC");
    
    for (let i = 0; i < models.received; i++) {
        modelSelect.add(new Option(models.rows[i][0], `${models.received - i}`))
    }
});

// Takes column names and rows returned by query_stats() to generate a table for them
// Returns the table as a string (HTML) and displayEnd <= 10 (how many elements rows are being displayed)
function generateTable(cols, rows) {
    // Limit of up to 10 rows per page
    let displayEnd = ((10 <= rows.length) ? 10 : rows.length);

    // Sets up first row (column headers)
    let html = "<table><tr>";
    for (let i = 0; i < cols.length; i++) {
        html += `<th>${cols[i]}</th>`;
    }
    html += "</tr>";

    // Loop through and add the data as rows
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

// Query, generate and display table for the desired page & sort options
// Called when clicking any of the analytics buttons, changing the model type, or adjusting sort options
// Assumes total number of rows <= 1000
async function analytics() {
    // Fetches all records for this query
    const allResults = await query_stats(mode, 1000, 0, "\""+sortBy.value+"\"", ascDesc.value, modelSelect.value);
    
    // Updates total number of records
    max = allResults.received;

    // Fetches the current page and generates the table with generateTable()
    const result = await query_stats(mode, 10, page*10, "\""+sortBy.value+"\"", ascDesc.value, modelSelect.value);
    let { table, displayEnd } = generateTable(result.cols, result.rows);

    // Calculates the row the page starts with (for example, page = 1 will display results 11-20)
    // Ternary operator shouldn't reach the false condition
    let start = (page*10+1 <= page*10+displayEnd) ? page*10+1 : page*10+displayEnd;
    
    // Note that we display page+1 because for the user, paging should start at 1
    displayText.innerText = `Displaying page ${page+1}: ${start}-${page*10+displayEnd} of ${max} rows`;

    // Show navigation buttons and sorting dropdown menus
    displayVisibility();

    // Display the table
    tableDiv.innerHTML = table;
}

// Query, generate and display table of saved models
// Called when clicking the "Models" button
// Assumes total number of models <= 1000
async function model_analytics() {
    // Fetch models
    const allResults = await query_stats(mode, 1000, 0, "\""+sortBy.value+"\"", ascDesc.value);

    // Update total number of models
    max = allResults.received;

    // Fetch desired range and generateTable()
    const result = await query_stats(mode, 10, page*10, "\""+sortBy.value+"\"", ascDesc.value);
    let { table, displayEnd } = generateTable(result.cols, result.rows);

    // Calculates row range
    let start = (page*10+1 <= page*10+displayEnd) ? page*10+1 : page*10+displayEnd;

    // Display information below table
    displayText.innerText = `Displaying page ${page+1}: ${start}-${page*10+displayEnd} of ${max} rows`;

    // Show navigation buttons but do not enable sorting dropdowns
    displayModels();

    // Display table
    tableDiv.innerHTML = table;
}

// Display Accuracy stats
// Called when clicking "Accuracy" button
function accuracy() {
    // Resets global variables and element visibility
    reset();

    // Set mode for queries
    mode = "accuracy";

    // Add appropriate sort options to dropdowns
    sortBy.add(characterOption);
    sortBy.add(numCorrectOption);
    sortBy.add(totalOption);
    sortBy.add(accuracyOption);

    // Set default sort options
    sortBy.value = "Accuracy";
    ascDesc.value = "ASC";

    // Query, generate and display table for the desired page & sort options
    analytics();
}

// Display Confusion pairs
// Called when clicking "Confusion"
function confusion() {
    // Reset global variables and element visiblity
    reset();

    // Set query mode
    mode = "confusion";

    // Add sort options to dropdowns
    sortBy.add(characterOption);
    sortBy.add(predictionOption);
    sortBy.add(countOption);

    // Set defaults
    sortBy.value = "Count";
    ascDesc.value = "DESC";

    // Query, generate and display
    analytics();
}

// Display saved Models
// Called when clicking "Models"
function models() {
    // Reset global variables and element visibility
    reset();

    // Set query mode
    mode = "models";

    // Add sort options and set defaults
    // Although the user can't sort the models, they are sorted by "Created At" DESC by default
    sortBy.add(timeOption);
    sortBy.value = "Created At";
    ascDesc.value = "DESC";
    model_analytics();
}

// User chooses Model version with a 'select' element, re-queries while filtering only for that model.
// Relies on the current modelSelect.value to determine which model to filter by
function modelChange() {
    page = 0;
    analytics();
}

// Make dropdowns, navigation, and reset visible
function displayVisibility() {
    sortDropdowns.removeAttribute("hidden");
    prevButton.removeAttribute("hidden");
    nextButton.removeAttribute("hidden");
    resetButton.removeAttribute("hidden");
}

// Similar to displayVisibility() but don't show the dropdowns
function displayModels() {
    prevButton.removeAttribute("hidden");
    nextButton.removeAttribute("hidden");
    resetButton.removeAttribute("hidden");
}

// Resets global variables, dropdowns, and visibility.
function reset() {
    // Global variables
    mode = null;
    page = 0;
    max = 0;

    // Clear sortBy Options
    sortBy.length = 0;

    // Element visibility
    sortDropdowns.setAttribute("hidden", "");
    prevButton.setAttribute("hidden", "");
    nextButton.setAttribute("hidden", "");
    resetButton.setAttribute("hidden", "");

    display.innerText = "Select a button to display results"

    // Clear table
    tableDiv.innerHTML = "";
}

// Display previous 10 elements
function prev() {
    // Checks that mode is valid and page doesn't go out of bounds before execution
    if (!mode) {
        return;
    } else if (page > 0) {
        page -= 1;
        analytics();
    }
}

// Display next 10 elements
function next() {
    // Checks that mode is valid and page doesn't go out of bounds before execution
    if (!mode) {
        return;
    } else if (page*10+10 <= max) {
        page += 1;
        analytics();
    }
}