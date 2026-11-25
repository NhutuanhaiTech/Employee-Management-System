-- liquibase formatted sql

-- changeset khang:func_get_salary_increase_history splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_salary_increase_history(
    p_employee_id UUID,
    p_submitter_username VARCHAR,
    p_priority_status VARCHAR,
    p_limit INT DEFAULT 10,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    increase_times INT,
    increase_date DATE,
    new_salary_level VARCHAR(100),
    reason TEXT,
    note TEXT,
    status VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
DECLARE
v_employee_created_by VARCHAR;
BEGIN

SELECT e.created_by INTO v_employee_created_by
FROM tbl_employees e
WHERE e.id = p_employee_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên (employee_id = %) không tồn tại trong hệ thống.', p_employee_id;
END IF;

    IF v_employee_created_by != p_submitter_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền xem lịch sử tăng lương. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép xem.', v_employee_created_by;
END IF;

RETURN QUERY
SELECT
    r.id,
    r.increase_times,
    r.increase_date,
    r.new_salary_level,
    r.reason,
    r.note,
    r.status
FROM
    tbl_salary_increase_requests r
WHERE
    r.employee_id = p_employee_id
ORDER BY
    CASE WHEN r.status = p_priority_status THEN 1 ELSE 2 END ASC,
    r.created_at DESC
    LIMIT
        p_limit
OFFSET
    p_offset;
END;
$$;
-- rollback DROP FUNCTION func_get_salary_increase_history(UUID, VARCHAR, VARCHAR, INT, INT);