WITH pred_counts AS (
    SELECT
        true_label,
        SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) AS num_correct,
        COUNT(*) AS total
    FROM predictions
    GROUP BY true_label
)
SELECT
    true_label,
    num_correct,
    total,
    num_correct::float / NULLIF(total, 0) AS accuracy
FROM pred_counts
ORDER BY accuracy ASC, true_label ASC
LIMIT %s OFFSET %s;