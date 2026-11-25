-- liquibase formatted sql

-- changeset khang:func_get_employee_by_id splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_employee_by_id(
    p_id UUID
)
RETURNS TABLE (
    id UUID,
    employee_code VARCHAR,
    full_name VARCHAR,
    gender VARCHAR,
    dob DATE,
    id_number VARCHAR,
    team_id UUID,
    phone VARCHAR,
    email VARCHAR,
    address VARCHAR,
    status VARCHAR,
    leader_id UUID,
    feed_back TEXT,
    feed_back_date DATE,
    position_name VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tbl_employees as e WHERE e.id = p_id) THEN
        RAISE EXCEPTION 'Nhân viên với ID % không tồn tại.', p_id;
END IF;

RETURN QUERY
SELECT
    e.id,
    e.employee_code,
    e.full_name,
    e.gender,
    e.dob,
    e.id_number,
    e.team_id,
    e.phone,
    e.email,
    e.address,
    e.status,
    ar.leader_id,
    ar.feed_back,
    ar.feed_back_date,
    p.position_name
FROM tbl_employees e
LEFT JOIN tbl_approval_requests ar
ON e.id = ar.employee_id
LEFT JOIN tbl_users ul ON ul.id = ar.leader_id
LEFT JOIN tbl_positions p ON ul.positions_id = p.id
WHERE e.id = p_id;
END;
$$;

-- rollback DROP FUNCTION func_get_employee_by_id(UUID);