-- liquibase formatted sql

-- changeset khang:sp_update_leader_comment_in_form splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_update_leader_comment_in_form(
    p_request_id UUID,
    p_leader_id UUID,
    p_leader_comment TEXT,
    p_allowed_statuses VARCHAR[]
)
LANGUAGE plpgsql
AS $$
DECLARE
v_actual_leader_id UUID;
    v_current_status VARCHAR;
BEGIN
SELECT leader_id, status
INTO v_actual_leader_id, v_current_status
FROM tbl_termination_requests
WHERE id = p_request_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy dữ liệu Yêu cầu (request_id = %).', p_request_id USING ERRCODE = 'P9999';
END IF;

    IF v_actual_leader_id != p_leader_id THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền nhập ý kiến vào biểu mẫu này.' USING ERRCODE = 'P4030';
END IF;

    IF v_current_status != ALL(p_allowed_statuses) THEN
         RAISE EXCEPTION 'Lỗi: Không thể cập nhật ý kiến. Đơn đang ở trạng thái (%).', v_current_status USING ERRCODE = 'P9999';
END IF;

UPDATE tbl_termination_forms
SET
    leader_comment = p_leader_comment,
    updated_at = CURRENT_TIMESTAMP
WHERE request_id = p_request_id;

END;
$$;
-- rollback DROP PROCEDURE sp_update_leader_comment_in_form(UUID, UUID, TEXT, VARCHAR[]);