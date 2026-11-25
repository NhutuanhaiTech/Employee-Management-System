-- liquibase formatted sql

-- changeset khang:create_sp_update_template splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_update_template(
    p_id UUID,
    p_form_data JSONB,
    p_updated_by VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
DECLARE
v_created_by VARCHAR(50);
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tbl_templates WHERE id = p_id) THEN
        RAISE EXCEPTION 'Không tìm thấy biểu mẫu với ID % trong bảng tbl_templates.', p_id;
END IF;

SELECT created_by INTO v_created_by FROM tbl_templates WHERE id = p_id;

IF v_created_by != p_updated_by THEN
        RAISE EXCEPTION 'Bạn không có quyền sửa biểu mẫu do người khác tạo.';
END IF;

UPDATE tbl_templates
SET
    form_data = COALESCE(p_form_data, form_data),
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_id;
END;
$$;
--rollback DROP PROCEDURE sp_update_template(UUID, JSONB, VARCHAR);