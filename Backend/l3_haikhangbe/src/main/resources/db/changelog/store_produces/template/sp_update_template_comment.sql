-- liquibase formatted sql

-- changeset khang:sp_update_template_comment splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_update_template_comment(
    p_template_id UUID,
    p_leader_id UUID,
    p_comment TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM tbl_approval_requests ar
        JOIN tbl_templates t ON ar.employee_id = t.employee_id
        WHERE t.id = p_template_id
          AND ar.leader_id = p_leader_id
          AND ar.status = 'PENDING'
    ) THEN
        RAISE EXCEPTION 'Lỗi: Không có quyền thao tác hoặc đơn trình đã đóng.';
END IF;

UPDATE tbl_templates
SET leader_comment = p_comment
WHERE id = p_template_id;
END;
$$;

-- rollback DROP PROCEDURE IF EXISTS sp_update_template_comment(UUID, UUID, TEXT);