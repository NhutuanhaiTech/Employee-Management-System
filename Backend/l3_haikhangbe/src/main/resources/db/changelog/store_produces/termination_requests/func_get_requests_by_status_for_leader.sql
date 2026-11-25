-- liquibase formatted sql

-- changeset khang:func_get_requests_by_status_for_leader splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_requests_by_status_for_leader(
    p_leader_id UUID,
    p_status VARCHAR,
    p_limit INT ,
    p_offset INT
)
RETURNS TABLE (
    request_id UUID,
    employee_code VARCHAR,
    employee_name VARCHAR,
    department_name VARCHAR,
    submit_date DATE,
    leader_name VARCHAR,
    leader_position VARCHAR,
    submit_note TEXT,
    submitter_name VARCHAR,
    status VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    r.id AS request_id,
    e.employee_code AS employee_code,
    e.full_name AS employee_name,
    t.team_name::VARCHAR AS department_name,
    r.submit_date,
    u_leader.full_name AS leader_name,
    p.position_name::VARCHAR AS leader_position,
    r.submit_note,
    u_submitter.full_name AS submitter_name,
    r.status
FROM tbl_termination_requests r
         JOIN tbl_termination_forms f ON r.id = f.request_id

         JOIN tbl_employees e ON r.employee_id = e.id
         LEFT JOIN tbl_teams t ON e.team_id = t.id

         JOIN tbl_users u_leader ON r.leader_id = u_leader.id
         LEFT JOIN tbl_positions p ON u_leader.positions_id = p.id

         JOIN tbl_users u_submitter ON r.submitter_id = u_submitter.id

WHERE r.leader_id = p_leader_id
  AND (p_status IS NULL OR r.status = p_status)

ORDER BY r.submit_date DESC, r.created_at DESC
    LIMIT p_limit
OFFSET p_offset;
END;
$$;
-- rollback DROP FUNCTION func_get_requests_by_status_for_leader(UUID, VARCHAR, INT, INT);