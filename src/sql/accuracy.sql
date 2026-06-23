WITH pred_counts AS (
    SELECT
        true_label,
        SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) AS num_correct,
        COUNT(*) AS total
    FROM predictions
    GROUP BY true_label
)
SELECT
    true_label AS "Character",
    num_correct AS "Number Correct",
    total AS "Total",
    num_correct::float / NULLIF(total, 0) AS "Accuracy"
FROM pred_counts
ORDER BY "Accuracy" ASC, "Character" ASC
LIMIT %s OFFSET %s;