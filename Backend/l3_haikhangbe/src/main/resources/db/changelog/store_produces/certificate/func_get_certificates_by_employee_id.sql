-- liquibase formatted sql

-- changeset khang:func_get_certificates_by_employee_id splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_certificates_by_employee_id(
    p_employee_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    start_date DATE,
    field VARCHAR,
    content TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    c.id,
    c.name,
    c.start_date,
    c.field,
    c.content
FROM tbl_certificates c
WHERE c.employee_id = p_employee_id;
END;
$$;

-- rollback DROP FUNCTION func_get_certificates_by_employee_id(UUID);