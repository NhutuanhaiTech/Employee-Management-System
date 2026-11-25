-- liquibase formatted sql

-- changeset khang:sp_resubmit_update_required_salary_request splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_resubmit_update_required_salary_request(
    p_id UUID,
    p_submitter_username VARCHAR,
    p_submit_date DATE,
    p_target_status VARCHAR,
    p_update_req_status VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
v_status VARCHAR(50);
    v_created_by VARCHAR;
    v_leader_id UUID;
BEGIN

SELECT sr.status, e.created_by, sr.leader_id
INTO v_status, v_created_by, v_leader_id
FROM tbl_salary_increase_requests sr
         JOIN tbl_employees e ON sr.employee_id = e.id
WHERE sr.id = p_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy yêu cầu tăng lương với id = %', p_id;
END IF;

    IF v_created_by != p_submitter_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền thao tác. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép nộp lại đơn.', v_created_by;
END IF;

    IF v_status != p_update_req_status THEN
        RAISE EXCEPTION 'Lỗi: Chỉ được phép nộp lại khi đơn đang ở trạng thái % (Yêu cầu bổ sung). Trạng thái hiện tại: %', p_update_req_status, v_status;
END IF;

    IF v_leader_id IS NULL THEN
        RAISE EXCEPTION 'Lỗi: Đơn này bị mất dữ liệu Người phê duyệt (leader_id). Không thể nộp lại!';
END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM tbl_salary_increase_decisions
        WHERE request_id = p_id
    ) THEN
        RAISE EXCEPTION 'Lỗi: Yêu cầu tăng lương này chưa có bản ghi Quyết định. Vui lòng cập nhật Quyết định trước khi nộp lại.';
END IF;

UPDATE tbl_salary_increase_requests
SET
    status = p_target_status,
    submit_date = p_submit_date,
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_id;

END;
$$;
-- rollback DROP PROCEDURE sp_resubmit_update_required_salary_request(UUID, VARCHAR, DATE, VARCHAR, VARCHAR);