-- liquibase formatted sql

-- changeset khang:sp_submit_termination_request splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_submit_termination_request(
    p_form_id UUID,
    p_submitter_id UUID,
    p_leader_id UUID,
    p_submit_note TEXT,
    p_submit_date DATE,
    p_target_status VARCHAR,
    p_allowed_statuses VARCHAR[],
    p_target_employee_status VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
v_request_id UUID;
    v_current_status VARCHAR;
    v_actual_submitter_id UUID;
    v_employee_id UUID;

    v_end_date DATE;
    v_reason TEXT;
    v_to_department VARCHAR;
    v_subject VARCHAR;
    v_handover_content TEXT;
BEGIN

IF NOT EXISTS (
        SELECT 1
        FROM tbl_users u
        JOIN tbl_user_role ur ON u.id = ur.id_user
        JOIN tbl_roles ro ON ur.id_role = ro.id
        WHERE u.id = p_leader_id
          AND ro.role IN ('LEADER')
    ) THEN
        RAISE EXCEPTION 'Lỗi: Người phê duyệt (leader_id) không tồn tại hoặc không có quyền phê duyệt.' USING ERRCODE = 'P9999';
END IF;
SELECT
    r.id, r.status, r.submitter_id, r.employee_id,
    f.end_date, f.reason, f.to_department, f.subject, f.handover_content
INTO
    v_request_id, v_current_status, v_actual_submitter_id, v_employee_id,
    v_end_date, v_reason, v_to_department, v_subject, v_handover_content
FROM tbl_termination_forms f
         JOIN tbl_termination_requests r ON f.request_id = r.id
WHERE f.id = p_form_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy dữ liệu Biểu mẫu (form_id = %).', p_form_id USING ERRCODE = 'P9999';
END IF;

    IF v_actual_submitter_id != p_submitter_id THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền trình đơn này.';
END IF;

    IF v_current_status != ALL(p_allowed_statuses) THEN
        RAISE EXCEPTION 'Lỗi: Trạng thái hiện tại của đơn (%) không hợp lệ để trình.', v_current_status USING ERRCODE = 'P9999';
END IF;

    IF v_end_date IS NULL
           OR '' IN (
               TRIM(COALESCE(v_reason, '')),
               TRIM(COALESCE(v_to_department, '')),
               TRIM(COALESCE(v_subject, '')),
               TRIM(COALESCE(v_handover_content, ''))
           )
    THEN
        RAISE EXCEPTION 'Lỗi: Biểu mẫu chưa đầy đủ thông tin. Vui lòng hoàn thiện (Ngày kết thúc, Lý do, Kính gửi, Về việc, Nội dung bàn giao) trước khi trình.' USING ERRCODE = 'P9999';
END IF;

UPDATE tbl_termination_requests
SET
    status = p_target_status,
    leader_id = p_leader_id,
    submit_note = p_submit_note,
    submit_date = p_submit_date,
    updated_at = CURRENT_TIMESTAMP
WHERE id = v_request_id;

IF p_target_employee_status IS NOT NULL THEN
UPDATE tbl_employees
SET status = p_target_employee_status,
    updated_at = CURRENT_TIMESTAMP
WHERE id = v_employee_id;
END IF;

END;
$$;
-- rollback DROP PROCEDURE sp_submit_termination_request(UUID, UUID, UUID, TEXT, DATE, VARCHAR, VARCHAR[], VARCHAR);