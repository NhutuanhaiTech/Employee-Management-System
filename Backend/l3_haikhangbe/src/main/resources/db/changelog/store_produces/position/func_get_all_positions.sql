-- liquibase formatted sql

-- changeset khang:create_func_get_all_positions runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION get_all_positions()
RETURNS TABLE (
    id UUID,
    position_name VARCHAR
) 
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    p.id,
    p.position_name
FROM tbl_positions p
ORDER BY p.created_at DESC;
END;
$$;
-- rollback DROP FUNCTION IF EXISTS get_all_positions();