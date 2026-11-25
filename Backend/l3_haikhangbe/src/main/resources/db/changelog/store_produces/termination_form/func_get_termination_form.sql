-- liquibase formatted sql

-- changeset khang:func_get_termination_form splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_termination_form(
    p_employee_id UUID,
    p_allowed_statuses VARCHAR[]
)
RETURNS TABLE (
    id UUID,
    request_id UUID,
    end_date DATE,
    reason TEXT,
    to_department VARCHAR,
    subject VARCHAR,
    handover_content TEXT,
    leader_comment TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tbl_employees e WHERE e.id = p_employee_id) THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên (employee_id = %) không tồn tại.', p_employee_id USING ERRCODE = 'P9999';
END IF;

RETURN QUERY
SELECT
    f.id,
    f.request_id,
    f.end_date,
    f.reason,
    f.to_department,
    f.subject,
    f.handover_content,
    f.leader_comment
FROM tbl_termination_forms f
         JOIN tbl_termination_requests r ON f.request_id = r.id
WHERE r.employee_id = p_employee_id
  AND r.status = ANY(p_allowed_statuses)
ORDER BY f.created_at DESC
    LIMIT 1;
END;
$$;
-- rollback DROP FUNCTION func_get_termination_form(UUID, VARCHAR[]);