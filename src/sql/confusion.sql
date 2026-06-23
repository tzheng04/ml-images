SELECT
    true_label AS "Character",
    predicted_label AS "Prediction",
    COUNT(*) AS "Count"
FROM predictions
WHERE NOT was_correct
GROUP BY "Character", "Prediction"
ORDER BY "Count" DESC, "Character" ASC
LIMIT %s OFFSET %s;