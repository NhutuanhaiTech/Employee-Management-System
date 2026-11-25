-- liquibase formatted sql

-- changeset khang:sp_insert_salary_increase_decision splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_insert_salary_increase_decision(
    p_request_id UUID,
    p_submitter_username VARCHAR,
    p_decision_number VARCHAR,
    p_effective_date DATE,
    p_content TEXT
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
v_new_id UUID;
    v_employee_created_by VARCHAR;
BEGIN

SELECT e.created_by INTO v_employee_created_by
FROM tbl_employees e
         JOIN tbl_salary_increase_requests r ON e.id = r.employee_id
WHERE r.id = p_request_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Đơn tăng lương (request_id = %) không tồn tại trong hệ thống.', p_request_id;
END IF;

    IF v_employee_created_by != p_submitter_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền thao tác. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép tạo quyết định tăng lương cho đơn này.', v_employee_created_by;
END IF;

    IF EXISTS (SELECT 1 FROM tbl_salary_increase_decisions WHERE request_id = p_request_id) THEN
        RAISE EXCEPTION 'Lỗi: Đơn tăng lương này đã có biểu mẫu quyết định đính kèm. Không thể tạo thêm mà chỉ được phép cập nhật (Update).';
END IF;

INSERT INTO tbl_salary_increase_decisions (
    request_id,
    decision_number,
    effective_date,
    decision_content
)
VALUES (
           p_request_id,
           p_decision_number,
           p_effective_date,
           p_content
       )
    RETURNING id INTO v_new_id;

RETURN v_new_id;
END;
$$;
-- rollback DROP FUNCTION sp_insert_salary_increase_decision(UUID, VARCHAR, VARCHAR, DATE, DATE, TEXT);