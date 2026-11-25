-- liquibase formatted sql

-- changeset khang:create_function_get_approval_requests_paginated splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION get_approval_requests_paginated(
        p_requester_id UUID,
    p_status VARCHAR DEFAULT NULL,
    p_limit INT DEFAULT 10,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    request_id UUID,
    employee_name VARCHAR,
    employee_code VARCHAR,
    team_name VARCHAR,
    submitter_name VARCHAR,
    submitter_position VARCHAR,
    submit_date DATE,
    leader_name VARCHAR,
    leader_position VARCHAR,
    submit_content TEXT,
    status VARCHAR,
    total_records BIGINT,
    employee_id UUID,
    leader_id UUID,
    feed_back TEXT,
    feed_back_date DATE
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
RETURN QUERY
    WITH paginated_requests AS (
        SELECT
            ar.id,
            ar.employee_id,
            ar.submitter_id,
            ar.leader_id,
            ar.submit_date,
            ar.submit_content,
            ar.status,
            ar.created_at,
            ar.feed_back,
            ar.feed_back_date,
            COUNT(*) OVER() AS total_records
        FROM tbl_approval_requests ar
        WHERE ar.leader_id = p_requester_id
          AND (p_status IS NULL OR ar.status = p_status)
        ORDER BY ar.created_at DESC
        LIMIT p_limit
        OFFSET p_offset
    )
SELECT
    pr.id,
    e.full_name,
    e.employee_code,
    t.team_name,
    u_sub.full_name,
    p_sub.position_name,
    pr.submit_date,
    u_lead.full_name,
    p_lead.position_name,
    pr.submit_content,
    pr.status,
    pr.total_records,
    pr.employee_id,
    pr.leader_id,
    pr.feed_back,
    pr.feed_back_date
FROM paginated_requests pr
         INNER JOIN tbl_employees e ON pr.employee_id = e.id
         LEFT JOIN tbl_teams t ON e.team_id = t.id
         INNER JOIN tbl_users u_sub ON pr.submitter_id = u_sub.id
         LEFT JOIN tbl_positions p_sub ON u_sub.positions_id = p_sub.id
         LEFT JOIN tbl_users u_lead ON pr.leader_id = u_lead.id
         LEFT JOIN tbl_positions p_lead ON u_lead.positions_id = p_lead.id
ORDER BY pr.created_at DESC;
END;
$$;

-- rollback DROP FUNCTION IF EXISTS get_approval_requests_paginated(UUID, VARCHAR, INT, INT);