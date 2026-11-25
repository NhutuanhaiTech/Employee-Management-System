-- liquibase formatted sql

-- changeset khang:func_get_salary_increase_requests_for_leader splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_salary_increase_requests_for_leader(
    p_leader_id UUID,
    p_status VARCHAR,
    p_limit INT,
    p_ofset INT
)
RETURNS TABLE (
    id UUID,
    employee_name VARCHAR,
    employee_code VARCHAR(50),
    team_name VARCHAR,
    submitter_name VARCHAR,
    submitter_position VARCHAR,
    submit_date DATE,
    leader_name VARCHAR,
    leader_position VARCHAR,
    submit_content TEXT,
    status VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    r.id,
    e.full_name::VARCHAR AS employee_name,
    e.employee_code,
    t.team_name::VARCHAR AS team_name,
    u.full_name::VARCHAR AS submitter_name,
    p.position_name::VARCHAR AS submitter_position,
    r.submit_date,
    lu.full_name::VARCHAR AS leader_name,
    lp.position_name::VARCHAR AS leader_position,
    r.reason AS submit_content,
    r.status
FROM
    tbl_salary_increase_requests r
        JOIN
    tbl_employees e ON r.employee_id = e.id
        LEFT JOIN
    tbl_teams t ON e.team_id = t.id
        JOIN
    tbl_users u ON r.submitter_id = u.id
        LEFT JOIN
    tbl_positions p ON u.positions_id = p.id
        LEFT JOIN
    tbl_users lu ON r.leader_id = lu.id
        LEFT JOIN
    tbl_positions lp ON lu.positions_id = lp.id
WHERE
    r.leader_id = p_leader_id
  AND (p_status IS NULL OR r.status = p_status)
ORDER BY
    r.created_at DESC;
END;
$$;
-- rollback DROP FUNCTION func_get_salary_increase_requests_for_leader(UUID, VARCHAR);