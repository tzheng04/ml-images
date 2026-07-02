SELECT
    true_label AS "Character",
    predicted_label AS "Prediction",
    COUNT(*) AS "Count"
FROM predictions
-- WHERE
GROUP BY "Character", "Prediction"
-- ORDER BY
LIMIT %s OFFSET %s;