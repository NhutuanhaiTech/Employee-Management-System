-- liquibase formatted sql

-- changeset khangduy:create_func_get_all_users runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION get_all_users(p_page int, p_size int)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
v_offset int;
   v_data jsonb;
BEGIN
    v_offset := (p_page - 1) * p_size;

WITH UserOffset AS (
    SELECT id, full_name, username, positions_id, is_active
    FROM tbl_users
    ORDER BY created_at DESC
    LIMIT p_size
OFFSET v_offset
    ),

    UserMapped AS (
SELECT u.id, u.full_name, u.username, p.position_name, u.is_active,
    jsonb_agg(r.role) FILTER (WHERE r.role IS NOT NULL) as roles
FROM UserOffset as u
    LEFT JOIN tbl_positions as p ON u.positions_id = p.id
    LEFT JOIN tbl_user_role as ur ON u.id = ur.id_user
    LEFT JOIN tbl_roles as r ON ur.id_role = r.id
GROUP BY u.id, u.full_name, u.username, p.position_name, u.is_active
    )

SELECT jsonb_agg(
               jsonb_build_object(
                       'id', id,
                       'userName', username,
                       'fullName', full_name,
                       'positionName', position_name,
                       'isActive', is_active,
                       'roles', COALESCE(roles, '[]'::jsonb)
               )
       ) INTO v_data
FROM UserMapped;

RETURN jsonb_build_object(
        'page', p_page,
        'size', p_size,
        'data', COALESCE(v_data, '[]'::jsonb)
       );
END;
$$;