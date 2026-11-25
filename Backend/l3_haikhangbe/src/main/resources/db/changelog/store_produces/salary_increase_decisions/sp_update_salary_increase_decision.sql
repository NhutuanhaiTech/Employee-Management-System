-- liquibase formatted sql

-- changeset khang:sp_update_salary_increase_decision splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_update_salary_increase_decision(
    p_request_id UUID,
    p_submiter_username VARCHAR,
    p_decision_number VARCHAR,
    p_effective_date DATE,
    p_content TEXT,
    p_status_required VARCHAR[]
)
LANGUAGE plpgsql
AS $$
DECLARE
v_created_by VARCHAR;
    v_current_status VARCHAR;
BEGIN
SELECT e.created_by, sr.status
INTO v_created_by, v_current_status
FROM tbl_salary_increase_requests sr
         JOIN tbl_employees e ON sr.employee_id = e.id
WHERE sr.id = p_request_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Đơn tăng lương (request_id = %) không tồn tại trong hệ thống.', p_request_id;
END IF;

    IF v_created_by != p_submiter_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền thao tác. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép cập nhật quyết định này.', v_created_by;
END IF;

    IF NOT (v_current_status = ANY(p_status_required)) THEN
        RAISE EXCEPTION 'Lỗi: Trạng thái hiện tại của đơn (%) không được phép cập nhật quyết định.', v_current_status;
END IF;

    IF NOT EXISTS (SELECT 1 FROM tbl_salary_increase_decisions WHERE request_id = p_request_id) THEN
        RAISE EXCEPTION 'Lỗi: Biểu mẫu quyết định cho đơn này chưa được tạo. Hãy sử dụng chức năng thêm mới (Insert) thay vì cập nhật.';
END IF;

UPDATE tbl_salary_increase_decisions
SET
    decision_number = p_decision_number,
    effective_date = p_effective_date,
    decision_content = p_content,
    updated_at = CURRENT_TIMESTAMP
WHERE request_id = p_request_id;

END;
$$;
-- rollback DROP PROCEDURE sp_update_salary_increase_decision(UUID, VARCHAR, VARCHAR, DATE, DATE, TEXT, VARCHAR[]);