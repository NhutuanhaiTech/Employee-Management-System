-- liquibase formatted sql
-- changeset khang:sp_reject_approval_request splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_reject_approval_request(
    p_request_id UUID,
    p_leader_id UUID,
    p_feed_back TEXT,
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
        RAISE EXCEPTION 'Lỗi: Chỉ được phép từ chối hồ sơ đang ở trạng thái %. Trạng thái hiện tại: %', p_required_status, v_current_status;
END IF;

    IF v_assigned_leader_id != p_leader_id THEN
        RAISE EXCEPTION 'Từ chối quyền truy cập: Bạn không phải là người có thẩm quyền duyệt phiếu này.';
END IF;

    IF p_feed_back IS NULL OR TRIM(p_feed_back) = '' THEN
        RAISE EXCEPTION 'Lỗi: Việc từ chối hồ sơ bắt buộc phải kèm theo lý do (feed_back).';
END IF;

UPDATE tbl_approval_requests
SET status = p_status,
    feed_back = p_feed_back,
    feed_back_date = CURRENT_DATE,
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_request_id;

UPDATE tbl_employees
SET status = p_status,
    updated_at = CURRENT_TIMESTAMP
WHERE id = v_employee_id;

END;
$$;

-- rollback DROP PROCEDURE IF EXISTS sp_reject_approval_request(UUID, UUID, TEXT, VARCHAR, VARCHAR);