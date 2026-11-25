-- liquibase formatted sql

-- changeset khang:sp_update_termination_form splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_update_termination_form(
    p_form_id UUID,
    p_username VARCHAR,
    p_end_date DATE,
    p_reason TEXT,
    p_to_department VARCHAR,
    p_subject VARCHAR,
    p_handover_content TEXT,
    p_allowed_statuses VARCHAR[]
)
LANGUAGE plpgsql
AS $$
DECLARE
v_request_status VARCHAR;
    v_employee_created_by VARCHAR;

BEGIN
SELECT r.status, e.created_by
INTO v_request_status, v_employee_created_by
FROM tbl_termination_requests r
         JOIN tbl_termination_forms f ON r.id = f.request_id
         JOIN tbl_employees e ON r.employee_id = e.id
WHERE f.id = p_form_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy dữ liệu Form (form_id = %).', p_form_id USING ERRCODE = 'P9999';
END IF;

    IF v_employee_created_by != p_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền. Chỉ người tạo hồ sơ (Tài khoản: %) mới được phép cập nhật Form này.', v_employee_created_by USING ERRCODE = 'P4030';
END IF;

    IF v_request_status != ALL(p_allowed_statuses) THEN
        RAISE EXCEPTION 'Lỗi: Không thể cập nhật Form. Trạng thái hiện tại của đơn (%) không cho phép chỉnh sửa.', v_request_status USING ERRCODE = 'P9999';
END IF;

UPDATE tbl_termination_forms
SET
    end_date = p_end_date,
    reason = p_reason,
    to_department = p_to_department,
    subject = p_subject,
    handover_content = p_handover_content
WHERE id = p_form_id;

END;
$$;
-- rollback DROP PROCEDURE sp_update_termination_form(UUID, VARCHAR, DATE, TEXT, VARCHAR, VARCHAR, TEXT, VARCHAR[]);