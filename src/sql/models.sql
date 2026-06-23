SELECT 
    version_name AS "Model Name",
    created_at AS "Created At",
    notes AS "Notes"
FROM models
-- ORDER BY
LIMIT %s OFFSET %s;
