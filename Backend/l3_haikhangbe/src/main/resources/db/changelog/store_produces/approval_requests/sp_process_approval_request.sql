-- liquibase formatted sql
-- changeset khang:sp_process_approval_request splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_process_approval_request(
    p_request_id UUID,
    p_leader_id UUID,
    p_appointment_date DATE,
    p_is_qualified BOOLEAN,
    p_status VARCHAR,
    p_required_status VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
v_assigned_leader_id UUID;
    v_employee_id UUID;
    v_current_status VARCHAR;
BEGIN
SELECT leader_id, employee_id, status
INTO v_assigned_leader_id, v_employee_id, v_current_status
FROM tbl_approval_requests
WHERE id = p_request_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy phiếu yêu cầu phê duyệt.';
END IF;

    IF v_current_status != p_required_status THEN
        RAISE EXCEPTION 'Lỗi: Chỉ được phép duyệt hồ sơ đang ở trạng thái %. Trạng thái hiện tại: %', p_required_status, v_current_status;
END IF;

    IF v_assigned_leader_id != p_leader_id THEN
        RAISE EXCEPTION 'Từ chối quyền truy cập: Bạn không phải là người có thẩm quyền duyệt phiếu này.';
END IF;

UPDATE tbl_approval_requests
SET status = p_status,
    is_qualified = COALESCE(p_is_qualified, is_qualified),
    appointment_date = p_appointment_date,
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_request_id;

UPDATE tbl_employees
SET is_work = true,
    status = p_status,
    updated_at = CURRENT_TIMESTAMP
WHERE id = v_employee_id;
END;
$$;