SELECT
    true_label AS "Character",
    predicted_label AS "Prediction",
    COUNT(*) AS "Count"
FROM predictions
WHERE NOT was_correct
GROUP BY "Character", "Prediction"
-- ORDER BY
LIMIT %s OFFSET %s;