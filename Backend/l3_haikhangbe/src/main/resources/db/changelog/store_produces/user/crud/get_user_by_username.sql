-- liquibase formatted sql

-- changeset khang:create_sp_get_user_by_username splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION get_user_by_username(p_username VARCHAR)
RETURNS TABLE (
    username VARCHAR,
    password VARCHAR,
    id UUID,
    "fullName" VARCHAR,
    "positionName" VARCHAR,
    role VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    us.username,
    us.password,
    us.id,
    us.full_name,
    p.position_name,
    rs.role
FROM tbl_users as us
         LEFT JOIN tbl_positions p ON us.positions_id = p.id
         LEFT JOIN tbl_user_role ur ON us.id = ur.id_user
         LEFT JOIN tbl_roles as rs ON ur.id_role = rs.id
WHERE us.username = p_username;
END;
$$;
-- rollback DROP FUNCTION IF EXISTS get_user_by_username(VARCHAR);