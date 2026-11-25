-- liquibase formatted sql

-- changeset khang:create_func_get_templates_by_employee splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_templates_by_employee_id(
    p_employee_id UUID
)
RETURNS TABLE (
    id UUID,
    employee_id UUID,
    form_type VARCHAR,
    status VARCHAR,
    form_data JSONB,
    leader_comment TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM tbl_employees as e WHERE e.id = p_employee_id) THEN
        RAISE EXCEPTION 'Không tìm thấy nhân viên với ID % trong hệ thống.', p_employee_id;
END IF;
RETURN QUERY
SELECT
    t.id,
    t.employee_id,
    t.form_type,
    t.status,
    t.form_data,
    t.leader_comment
FROM tbl_templates t
WHERE t.employee_id = p_employee_id
ORDER BY t.created_at DESC;
END;
$$;
--rollback DROP FUNCTION func_get_templates_by_employee(UUID);