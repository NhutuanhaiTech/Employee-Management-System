-- liquibase formatted sql

-- changeset khang:func_get_salary_increase_decision_by_request_id splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_salary_increase_decision_by_request_id(
    p_request_id UUID,
    p_username VARCHAR
)
RETURNS TABLE (
    id UUID,
    request_id UUID,
    decision_number VARCHAR(100),
    effective_date DATE,
    decision_content TEXT,
    leader_comment TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
v_employee_created_by VARCHAR;
BEGIN

SELECT e.created_by INTO v_employee_created_by
FROM tbl_employees e
         JOIN tbl_salary_increase_requests r ON e.id = r.employee_id
WHERE r.id = p_request_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Đơn tăng lương (request_id = %) không tồn tại trong hệ thống.', p_request_id;
END IF;

--     IF v_employee_created_by != p_username THEN
--         RAISE EXCEPTION 'Lỗi: Bạn không có quyền xem quyết định này. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép truy xuất.', v_employee_created_by;
-- END IF;

RETURN QUERY
SELECT
    d.id,
    d.request_id,
    d.decision_number,
    d.effective_date,
    d.decision_content,
    d.leader_comment
FROM
    tbl_salary_increase_decisions d
WHERE
    d.request_id = p_request_id;
END;
$$;
-- rollback DROP FUNCTION func_get_salary_increase_decision_by_request_id(UUID, VARCHAR);