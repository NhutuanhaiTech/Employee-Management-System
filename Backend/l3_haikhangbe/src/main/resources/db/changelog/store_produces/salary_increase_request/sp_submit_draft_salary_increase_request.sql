-- liquibase formatted sql

-- changeset khang:sp_submit_draft_salary_increase_request splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_submit_draft_salary_increase_request(
    p_id UUID,
    p_submitter_username VARCHAR,
    p_leader_id UUID,
    p_submit_date DATE,
    p_target_status VARCHAR,
    p_draft_status VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
v_status VARCHAR(50);
    v_submitter_id UUID;
    v_created_by VARCHAR;
BEGIN
SELECT sr.status, sr.submitter_id, e.created_by
INTO v_status, v_submitter_id, v_created_by
FROM tbl_salary_increase_requests sr
         JOIN tbl_employees e ON sr.employee_id = e.id
WHERE sr.id = p_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy yêu cầu tăng lương với id = %', p_id;
END IF;

    IF v_created_by != p_submitter_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền thao tác. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép trình duyệt.', v_created_by;
END IF;

    IF v_status != p_draft_status THEN
        RAISE EXCEPTION 'Lỗi: Chỉ được phép trình duyệt khi đơn đang ở trạng thái % (Lưu mới). Trạng thái hiện tại: %', p_draft_status, v_status;
END IF;

    IF p_leader_id IS NULL THEN
        RAISE EXCEPTION 'Lỗi: Ở trạng thái Lưu mới, bạn bắt buộc phải chọn Người phê duyệt (leader_id).';
END IF;

    IF v_submitter_id = p_leader_id THEN
        RAISE EXCEPTION 'Lỗi: Người tạo đơn và Người phê duyệt không được phép là cùng một người.';
END IF;

  IF NOT EXISTS (
        SELECT 1
        FROM tbl_users u
        JOIN tbl_user_role ur ON u.id = ur.id_user
        JOIN tbl_roles r ON ur.id_role = r.id
        WHERE u.id = p_leader_id AND r.role IN ('LEADER')
    ) THEN
        RAISE EXCEPTION 'Lỗi: Người phê duyệt (leader_id = %) không tồn tại hoặc tài khoản này không có quyền Quản lý/Lãnh đạo.', p_leader_id;
END IF;

IF NOT EXISTS (
        SELECT 1
        FROM tbl_salary_increase_decisions
        WHERE request_id = p_id
    ) THEN
        RAISE EXCEPTION 'Lỗi: Yêu cầu tăng lương này chưa có bản ghi Quyết định. Vui lòng tạo Quyết định trước khi trình duyệt.';
END IF;

UPDATE tbl_salary_increase_requests
SET
    status = p_target_status,
    leader_id = p_leader_id,
    submit_date = p_submit_date,
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_id;

END;
$$;
-- rollback DROP PROCEDURE sp_submit_draft_salary_increase_request(UUID, VARCHAR, UUID, DATE, VARCHAR, VARCHAR);