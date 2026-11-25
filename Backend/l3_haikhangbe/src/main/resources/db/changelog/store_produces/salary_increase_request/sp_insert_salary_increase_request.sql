-- liquibase formatted sql

-- changeset khang:sp_insert_salary_increase_request splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION sp_insert_salary_increase_request(
    p_employee_id UUID,
    p_submitter_id UUID,
    p_submitter_username VARCHAR,
    p_increase_times INT,
    p_increase_date DATE,
    p_new_salary_level VARCHAR,
    p_reason TEXT,
    p_note TEXT,
    p_status VARCHAR,
    p_approved_status VARCHAR
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
v_new_id UUID;
    v_is_work BOOLEAN;
    v_actual_increase_times INT;
    v_employee_created_by VARCHAR;
BEGIN

SELECT is_work, created_by
INTO v_is_work, v_employee_created_by
FROM tbl_employees
WHERE id = p_employee_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên (employee_id = %) không tồn tại trong hệ thống.', p_employee_id;
END IF;

    IF v_employee_created_by != p_submitter_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền thao tác. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép tạo đơn tăng lương cho nhân viên này.', v_employee_created_by;
END IF;

    IF v_is_work = false THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên này đã nghỉ việc, không thể tạo đơn tăng lương.';
END IF;

    IF NOT EXISTS (SELECT 1 FROM tbl_users WHERE id = p_submitter_id) THEN
        RAISE EXCEPTION 'Lỗi: Người tạo đơn không hợp lệ hoặc không tồn tại.';
END IF;

SELECT COUNT(*) INTO v_actual_increase_times
FROM tbl_salary_increase_requests
WHERE employee_id = p_employee_id
  AND status = p_approved_status;

v_actual_increase_times := v_actual_increase_times + 1;

    IF p_increase_times != v_actual_increase_times THEN
        RAISE EXCEPTION 'Lỗi: Lần tăng lương không hợp lệ. Số lần tăng lương đúng phải là %', v_actual_increase_times;
END IF;

    -- 6. Insert vào DB
INSERT INTO tbl_salary_increase_requests (
    employee_id,
    submitter_id,
    increase_times,
    increase_date,
    new_salary_level,
    reason,
    note,
    status
)
VALUES (
           p_employee_id,
           p_submitter_id,
           p_increase_times,
           p_increase_date,
           p_new_salary_level,
           p_reason,
           p_note,
           p_status
       )
    RETURNING id INTO v_new_id;

RETURN v_new_id;
END;
$$;
-- rollback DROP FUNCTION sp_insert_salary_increase_request(UUID, UUID, VARCHAR, INT, DATE, VARCHAR, TEXT, TEXT, VARCHAR, VARCHAR);