-- liquibase formatted sql

-- changeset khang:sp_update_salary_increase_request splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION sp_update_salary_increase_request(
    p_id UUID,
    p_submitter_username VARCHAR,
    p_increase_times INT,
    p_increase_date DATE,
    p_new_salary_level VARCHAR,
    p_reason TEXT,
    p_note TEXT,
    p_statuses_allowed VARCHAR[],
    p_approved_status VARCHAR
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
v_is_work BOOLEAN;
    v_existing_employee_id UUID;
    v_current_status VARCHAR;
    v_actual_increase_times INT;
    v_employee_created_by VARCHAR;
BEGIN

SELECT employee_id, status
INTO v_existing_employee_id, v_current_status
FROM tbl_salary_increase_requests
WHERE id = p_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Bản ghi tăng lương (id = %) không tồn tại.', p_id;
END IF;

SELECT is_work, created_by
INTO v_is_work, v_employee_created_by
FROM tbl_employees
WHERE id = v_existing_employee_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên (employee_id = %) không tồn tại trong hệ thống.', v_existing_employee_id;
END IF;

    IF v_employee_created_by != p_submitter_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền thao tác. Chỉ người tạo hồ sơ nhân viên này (Người tạo: %) mới có quyền cập nhật.', v_employee_created_by;
END IF;

    IF v_current_status != ALL(p_statuses_allowed) THEN
        RAISE EXCEPTION 'Lỗi: Chỉ được chỉnh sửa khi trạng thái là Lưu mới hoặc Yêu cầu bổ sung';
END IF;

    IF v_is_work = false THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên này đã nghỉ việc, không thể cập nhật đơn tăng lương.';
END IF;

SELECT COUNT(*) INTO v_actual_increase_times
FROM tbl_salary_increase_requests
WHERE employee_id = v_existing_employee_id
  AND status = p_approved_status;

v_actual_increase_times := v_actual_increase_times + 1;

    IF p_increase_times != v_actual_increase_times THEN
        RAISE EXCEPTION 'Lỗi: Lần tăng lương không hợp lệ. Số lần tăng lương đúng phải là %', v_actual_increase_times;
END IF;

UPDATE tbl_salary_increase_requests
SET
    increase_times = p_increase_times,
    increase_date = p_increase_date,
    new_salary_level = p_new_salary_level,
    reason = p_reason,
    note = p_note,
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_id;

RETURN p_id;
END;
$$;
-- rollback DROP FUNCTION sp_update_salary_increase_request(UUID, VARCHAR, INT, DATE, VARCHAR, TEXT, TEXT, VARCHAR[], VARCHAR);