-- liquibase formatted sql

-- changeset khang:sp_leader_respond_salary_increase_request splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_leader_respond_salary_increase_request(
    p_id UUID,
    p_leader_id UUID,
    p_leader_feedback TEXT,
    p_leader_feedback_date DATE,
    p_target_status VARCHAR,
    p_require_status VARCHAR[]
)
LANGUAGE plpgsql
AS $$
DECLARE
v_current_status VARCHAR(50);
    v_assigned_leader_id UUID;
BEGIN
SELECT status, leader_id
INTO v_current_status, v_assigned_leader_id
FROM tbl_salary_increase_requests
WHERE id = p_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy yêu cầu tăng lương với id = %', p_id;
END IF;

    IF v_assigned_leader_id != p_leader_id THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền thao tác do không phải là người được phân công duyệt yêu cầu này.';
END IF;

    IF NOT (v_current_status = ANY(p_require_status)) THEN
        RAISE EXCEPTION 'Lỗi: Chỉ có thể phản hồi khi yêu cầu đang ở trạng thái hợp lệ. Trạng thái hiện tại: %', v_current_status;
END IF;

UPDATE tbl_salary_increase_requests
SET
    status = p_target_status,
    leader_feedback = p_leader_feedback,
    feedback_date = p_leader_feedback_date,
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_id;

END;
$$;
-- rollback DROP PROCEDURE sp_leader_respond_salary_increase_request(UUID, UUID, TEXT, DATE, VARCHAR, VARCHAR[]);