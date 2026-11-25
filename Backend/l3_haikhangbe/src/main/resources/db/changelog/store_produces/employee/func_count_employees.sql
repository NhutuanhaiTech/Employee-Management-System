-- liquibase formatted sql
-- changeset khang:func_count_employees splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_count_employees(
    p_username VARCHAR
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
v_total BIGINT;
BEGIN
SELECT COUNT(*) INTO v_total
FROM tbl_employees
WHERE created_by = p_username;

RETURN v_total;
END;
$$;
-- rollback DROP FUNCTION func_count_employees(VARCHAR);