-- liquibase formatted sql

-- changeset khang:create_fn_insert_template splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_insert_template(
    p_employee_id UUID,
    p_form_type VARCHAR(100),
    p_form_data JSONB,
    p_created_by VARCHAR(50)
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
v_template_id UUID;
BEGIN

    IF NOT EXISTS (
       SELECT 1 FROM tbl_employees WHERE id = p_employee_id) THEN
       RAISE EXCEPTION 'id nhân viên không tồn tại';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM tbl_templates
        WHERE employee_id = p_employee_id AND form_type = p_form_type
    ) THEN
        RAISE EXCEPTION 'Biểu mẫu loại % đã tồn tại cho nhân viên này.', p_form_type;
    END IF;

    -- Thêm mới với username người tạo
INSERT INTO tbl_templates (
    employee_id,
    form_type,
    form_data,
    created_by
) VALUES (
             p_employee_id,
             p_form_type,
             p_form_data,
             p_created_by
         ) RETURNING id INTO v_template_id;

RETURN v_template_id;
END;
$$;
--rollback DROP FUNCTION fn_insert_template(UUID, VARCHAR, JSONB, VARCHAR);