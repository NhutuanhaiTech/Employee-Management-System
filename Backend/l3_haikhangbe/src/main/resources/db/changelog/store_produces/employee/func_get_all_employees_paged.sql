-- liquibase formatted sql
-- changeset khang:func_get_all_employees_paged splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_all_employees_paged(
    p_limit INT,
    p_offset INT,
    p_status VARCHAR,
    p_is_work BOOLEAN
)
RETURNS TABLE (
    id UUID,
    "employeeCode" VARCHAR,
    "idNumber" VARCHAR,
    "fullName" VARCHAR,
    gender VARCHAR,
    dob DATE,
    phone VARCHAR,
    email VARCHAR,
    "teamName" VARCHAR,
    status VARCHAR,
    "createdName" VARCHAR,
    "positionName" VARCHAR,
    "usernameCreated" VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    e.id            AS id,
    e.employee_code AS "employeeCode",
    e.id_number     AS "idNumber",
    e.full_name     AS "fullName",
    e.gender        AS gender,
    e.dob           AS dob,
    e.phone         AS phone,
    e.email         AS email,
    t.team_name     AS "teamName",
    e.status        AS status,
    u.full_name      AS "createdName",
    p.position_name  AS "positionName",
    e.created_by AS "usernameCreated"
FROM tbl_employees e
         LEFT JOIN tbl_teams t ON e.team_id = t.id
         LEFT JOIN tbl_users u ON e.created_by = u.username
         LEFT JOIN tbl_positions p ON u.positions_id = p.id
WHERE (p_status IS NULL OR TRIM(p_status) = '' OR p_status = e.status)
  AND (p_is_work IS NULL OR e.is_work = p_is_work)
ORDER BY e.created_at DESC
    LIMIT p_limit
OFFSET p_offset;
END;
$$;
-- rollback DROP FUNCTION func_get_all_employees_paged(INT, INT, VARCHAR);