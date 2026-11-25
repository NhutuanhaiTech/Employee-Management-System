-- liquibase formatted sql
-- changeset khang:sp_update_approval_request splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_update_approval_request(
    p_employee_id UUID,
    p_submitter_id UUID,
    p_submit_date DATE,
    p_submit_content TEXT,
    p_leader_id UUID,
    p_min_templates INT,
    p_valid_status_1 VARCHAR,
    p_valid_status_2 VARCHAR,
    p_target_status VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
v_form_count INT;
    v_request_id UUID;
    v_existing_submitter_id UUID;
    v_existing_leader_id UUID;
    v_employee_status VARCHAR;
BEGIN

SELECT status INTO v_employee_status FROM tbl_employees WHERE id = p_employee_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên không tồn tại trong hệ thống.';
END IF;

    IF v_employee_status NOT IN (p_valid_status_1, p_valid_status_2) THEN
        RAISE EXCEPTION 'Lỗi: Hồ sơ đang ở trạng thái %, không được phép chỉnh sửa.', v_employee_status;
END IF;

SELECT COUNT(*) INTO v_form_count FROM tbl_templates WHERE employee_id = p_employee_id;
IF v_form_count < p_min_templates THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên chưa hoàn thiện đủ % biểu mẫu bắt buộc.', p_min_templates;
END IF;

SELECT id, submitter_id, leader_id
INTO v_request_id, v_existing_submitter_id, v_existing_leader_id
FROM tbl_approval_requests
WHERE employee_id = p_employee_id
    LIMIT 1;

IF v_request_id IS NULL THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy hồ sơ trình duyệt nào cần cập nhật.';
END IF;

    IF v_existing_submitter_id != p_submitter_id THEN
        RAISE EXCEPTION 'Lỗi: Không có quyền chỉnh sửa. Chỉ người tạo yêu cầu ban đầu mới được phép cập nhật.';
END IF;

    IF v_existing_leader_id != p_leader_id THEN
        RAISE EXCEPTION 'Lỗi: Yêu cầu cập nhật không hợp lệ. Phải gửi lại cho đúng quản lý ban đầu.';
END IF;

UPDATE tbl_approval_requests
SET submit_content = p_submit_content,
    submit_date = p_submit_date,
    status = p_target_status,
    feed_back = null,
    feed_back_date = null,
    updated_at = CURRENT_TIMESTAMP
WHERE id = v_request_id;

UPDATE tbl_employees
SET status = p_target_status,
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_employee_id;

END;
$$;
-- rollback DROP PROCEDURE sp_update_approval_request(UUID, UUID, DATE, TEXT, UUID, INT, VARCHAR, VARCHAR, VARCHAR);