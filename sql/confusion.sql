SELECT
    true_label,
    predicted_label,
    COUNT(*) as num_instances
FROM predictions
WHERE NOT was_correct
GROUP BY true_label, predicted_label
ORDER BY num_instances DESC, true_label ASC
LIMIT %s OFFSET %s;