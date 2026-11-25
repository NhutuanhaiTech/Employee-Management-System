-- liquibase formatted sql

-- changeset khang:func_insert_termination_form splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_insert_termination_form(
    p_request_id UUID,
    p_submitter_username VARCHAR,
    p_end_date DATE,
    p_reason TEXT,
    p_allowed_status VARCHAR
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
v_new_id UUID;
    v_employee_created_by VARCHAR;
    v_request_status VARCHAR;
BEGIN

SELECT e.created_by, r.status
INTO v_employee_created_by, v_request_status
FROM tbl_termination_requests r
         JOIN tbl_employees e ON r.employee_id = e.id
WHERE r.id = p_request_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy yêu cầu kết thúc (request_id = %) hoặc nhân viên tương ứng.', p_request_id USING ERRCODE = 'P9999';
END IF;

    IF v_employee_created_by != p_submitter_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép thêm đơn từ (form) này.', v_employee_created_by USING ERRCODE = 'P4030';
END IF;

    IF v_request_status != p_allowed_status THEN
        RAISE EXCEPTION 'Lỗi: Không thể thêm mới form. Yêu cầu hiện đang ở trạng thái "%", chỉ được phép thêm mới khi ở trạng thái %.', v_request_status, p_allowed_status USING ERRCODE = 'P9999';
END IF;

    IF EXISTS (
        SELECT 1
        FROM tbl_termination_forms
        WHERE request_id = p_request_id
    ) THEN
        RAISE EXCEPTION 'Lỗi: Đã tồn tại đơn từ (form) cho request_id = % này. Bạn chỉ có thể cập nhật (Update) chứ không thể tạo mới.', p_request_id USING ERRCODE = 'P9999';
END IF;

INSERT INTO tbl_termination_forms (
    request_id,
    end_date,
    reason
)
VALUES (
           p_request_id,
           p_end_date,
           p_reason
       )
    RETURNING id INTO v_new_id;

RETURN v_new_id;
END;
$$;
-- rollback DROP FUNCTION func_insert_termination_form(UUID, VARCHAR, DATE, TEXT, VARCHAR);