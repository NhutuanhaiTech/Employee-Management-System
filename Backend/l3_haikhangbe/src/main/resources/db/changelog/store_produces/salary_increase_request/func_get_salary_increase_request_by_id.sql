-- liquibase formatted sql

-- changeset khang:func_get_salary_increase_request_by_id splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_salary_increase_request_by_id(
    p_id UUID,
    p_submitter_username VARCHAR
)
RETURNS TABLE (
    increase_date DATE,
    increase_times INT,
    new_salary_level VARCHAR(100),
    reason TEXT,
    note TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
v_employee_created_by VARCHAR;
BEGIN
SELECT e.created_by INTO v_employee_created_by
FROM tbl_employees e
         JOIN tbl_salary_increase_requests r ON e.id = r.employee_id
WHERE r.id = p_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Bản ghi đề xuất tăng lương (id = %) không tồn tại.', p_id;
END IF;

--     IF v_employee_created_by != p_submitter_username THEN
--         RAISE EXCEPTION 'Lỗi: Bạn không có quyền xem chi tiết. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép xem.', v_employee_created_by;
-- END IF;

RETURN QUERY
SELECT
    r.increase_date,
    r.increase_times,
    r.new_salary_level,
    r.reason,
    r.note
FROM
    tbl_salary_increase_requests r
WHERE
    r.id = p_id;
END;
$$;
-- rollback DROP FUNCTION func_get_salary_increase_request_by_id(UUID, VARCHAR);