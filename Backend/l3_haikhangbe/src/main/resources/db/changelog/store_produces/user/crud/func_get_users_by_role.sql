-- liquibase formatted sql
-- changeset khang:create_func_get_leaders splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_users_by_role(
    p_role_name VARCHAR
)
RETURNS TABLE(
    id UUID,
    fullName VARCHAR,
    positionName VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT DISTINCT
    u.id as id,
    u.full_name as fullName,
    p.position_name as positionName
FROM tbl_roles as r
         INNER JOIN tbl_user_role as ur ON r.id = ur.id_role
         INNER JOIN tbl_users as u ON ur.id_user = u.id
         LEFT JOIN tbl_positions as p ON p.id = u.positions_id
WHERE r.role = p_role_name;
END;
$$;

-- rollback DROP FUNCTION func_get_leaders(VARCHAR);