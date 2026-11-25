-- liquibase formatted sql

-- changeset khang:sp_require_update_termination_request splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_require_update_termination_request(
    p_request_id UUID,
    p_leader_id UUID,
    p_leader_feedback TEXT,
    p_decision_date DATE,
    p_target_status VARCHAR,
    p_allowed_statuses VARCHAR[],
    p_update_required_employee_status VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
v_actual_leader_id UUID;
    v_current_status VARCHAR;
    v_employee_id UUID;
BEGIN
SELECT leader_id, status, employee_id
INTO v_actual_leader_id, v_current_status, v_employee_id
FROM tbl_termination_requests
WHERE id = p_request_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy dữ liệu Yêu cầu (request_id = %).', p_request_id USING ERRCODE = 'P9999';
END IF;

    IF v_actual_leader_id != p_leader_id THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền phản hồi đơn này.' USING ERRCODE = 'P4030';
END IF;

    IF v_current_status != ALL(p_allowed_statuses) THEN
        RAISE EXCEPTION 'Lỗi: Không thể thao tác. Đơn đang ở trạng thái (%).', v_current_status USING ERRCODE = 'P9999';
END IF;

UPDATE tbl_termination_requests
SET status = p_target_status,
    leader_feedback = p_leader_feedback,
    decision_date = COALESCE(p_decision_date, CURRENT_DATE),
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_request_id;

UPDATE tbl_employees
SET status = p_update_required_employee_status,
    updated_at = CURRENT_TIMESTAMP
WHERE id = v_employee_id;

END;
$$;
-- rollback DROP PROCEDURE sp_require_update_termination_request(UUID, UUID, TEXT, DATE, VARCHAR, VARCHAR[], VARCHAR);