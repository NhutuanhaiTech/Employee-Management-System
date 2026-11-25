-- liquibase formatted sql

-- changeset khang:create_func_get_all_roles runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION get_all_roles()
RETURNS TABLE (
    id UUID,
    role VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    r.id,
    r.role
FROM tbl_roles r
ORDER BY r.role ASC;
END;
$$;
-- rollback DROP FUNCTION IF EXISTS get_all_roles();