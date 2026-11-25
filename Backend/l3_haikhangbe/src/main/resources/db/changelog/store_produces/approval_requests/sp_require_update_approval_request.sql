-- liquibase formatted sql
-- changeset khang:sp_require_update_approval_request splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_require_update_approval_request(
    p_request_id UUID,
    p_leader_id UUID,
    p_feed_back TEXT,
    p_valid_status VARCHAR, -- Trạng thái hợp lệ (truyền 'PENDING' từ Java)
    p_target_status VARCHAR -- Trạng thái đích (truyền 'UPDATE_REQUIRED' từ Java)
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
        RAISE EXCEPTION 'Lỗi: Không tìm thấy phiếu yêu cầu trình duyệt.';
END IF;

    IF v_current_status != p_valid_status THEN
        RAISE EXCEPTION 'Lỗi: Chỉ phiếu ở trạng thái chờ duyệt (%) mới được phép yêu cầu bổ sung. Trạng thái hiện tại đang là %.', p_valid_status, v_current_status;
END IF;

    IF v_assigned_leader_id != p_leader_id THEN
        RAISE EXCEPTION 'Từ chối quyền truy cập: Bạn không phải là người có thẩm quyền duyệt phiếu này.';
END IF;

UPDATE tbl_approval_requests
SET status = p_target_status,
    feed_back = p_feed_back,
    feed_back_date = CURRENT_DATE,
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_request_id;

UPDATE tbl_employees
SET status = p_target_status,
    updated_at = CURRENT_TIMESTAMP
WHERE id = v_employee_id;

END;
$$;
-- rollback DROP PROCEDURE sp_require_update_approval_request(UUID, UUID, TEXT, VARCHAR, VARCHAR);