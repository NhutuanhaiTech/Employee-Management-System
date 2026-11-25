-- liquibase formatted sql
-- changeset khang:fn_insert_approval_request splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION fn_insert_approval_request(
    p_employee_id UUID,
    p_submitter_id UUID,
    p_submit_date DATE,
    p_submit_content TEXT,
    p_leader_id UUID,
    p_min_template INT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
v_form_count INT;
    v_request_id UUID;
    v_employee_status VARCHAR;
    v_status VARCHAR := 'PENDING';
BEGIN
    IF p_submitter_id = p_leader_id THEN
        RAISE EXCEPTION 'Lỗi: Người trình duyệt và Người phê duyệt không được phép là cùng một người.';
END IF;

    IF NOT EXISTS (SELECT 1 FROM tbl_users WHERE id = p_leader_id) THEN
        RAISE EXCEPTION 'Lỗi: Người phê duyệt (leader_id) % không tồn tại trong hệ thống.', p_leader_id;
END IF;

SELECT status INTO v_employee_status FROM tbl_employees WHERE id = p_employee_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên với ID % không tồn tại trong hệ thống.', p_employee_id;
END IF;

    IF v_employee_status != 'DRAFT' THEN
        RAISE EXCEPTION 'Lỗi: Chỉ hồ sơ tạo mới (DRAFT) mới được phép trình duyệt lần đầu. Trạng thái hiện tại đang là %.', v_employee_status;
END IF;

SELECT COUNT(*) INTO v_form_count FROM tbl_templates WHERE employee_id = p_employee_id;

IF v_form_count < p_min_template THEN
    RAISE EXCEPTION 'Lỗi: Nhân viên chưa hoàn thiện đủ % biểu mẫu bắt buộc. Hiện tại mới có %/% biểu mẫu.',
                    p_min_template, v_form_count, p_min_template;
END IF;

    IF EXISTS (SELECT 1 FROM tbl_approval_requests WHERE employee_id = p_employee_id) THEN
        RAISE EXCEPTION 'Lỗi: Yêu cầu trình lãnh đạo cho nhân viên này đã được tạo.';
END IF;

INSERT INTO tbl_approval_requests (
    employee_id, submitter_id, leader_id, submit_date, submit_content, status
) VALUES (
             p_employee_id, p_submitter_id, p_leader_id, p_submit_date, p_submit_content, v_status
         ) RETURNING id INTO v_request_id;

UPDATE tbl_employees
SET status = v_status
WHERE id = p_employee_id;

RETURN v_request_id;
END;
$$;