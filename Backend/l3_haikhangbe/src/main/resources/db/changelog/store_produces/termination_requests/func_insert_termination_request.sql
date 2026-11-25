-- liquibase formatted sql

-- changeset khang:func_insert_termination_request splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_insert_termination_request(
    p_employee_id UUID,
    p_submitter_id UUID,
    p_submitter_username VARCHAR,
    p_status VARCHAR,
    p_active_statuses VARCHAR[],
    p_employee_status VARCHAR
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
v_new_id UUID;
    v_is_work BOOLEAN;
    v_employee_created_by VARCHAR;
BEGIN

SELECT is_work, created_by
INTO v_is_work, v_employee_created_by
FROM tbl_employees
WHERE id = p_employee_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên (employee_id = %) không tồn tại.', p_employee_id USING ERRCODE = 'P9999';
END IF;

    IF v_employee_created_by != p_submitter_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép kết thúc hồ sơ nhân viên này.', v_employee_created_by USING ERRCODE = 'P4030';
END IF;

    IF v_is_work = false THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên này đã nghỉ việc, không thể tạo thêm đơn kết thúc hồ sơ.' USING ERRCODE = 'P9999';
END IF;

    IF EXISTS (
        SELECT 1
        FROM tbl_termination_requests
        WHERE employee_id = p_employee_id
          AND status = ANY(p_active_statuses)
    ) THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên này đang có hồ sơ chưa hoàn tất. Không thể tạo mới!' USING ERRCODE = 'P9999';
END IF;

INSERT INTO tbl_termination_requests (
    employee_id,
    submitter_id,
    status
)
VALUES (
           p_employee_id,
           p_submitter_id,
           p_status
       )
    RETURNING id INTO v_new_id;

UPDATE tbl_employees
SET status = p_employee_status
WHERE id = p_employee_id;

RETURN v_new_id;
END;
$$;
-- rollback DROP FUNCTION func_insert_termination_request(UUID, UUID, VARCHAR, VARCHAR, VARCHAR[], VARCHAR);