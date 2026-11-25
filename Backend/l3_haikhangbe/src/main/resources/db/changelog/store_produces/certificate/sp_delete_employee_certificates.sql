-- liquibase formatted sql

-- changeset khang:sp_delete_employee_certificates splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_delete_employee_certificates(
    p_employee_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
DELETE FROM tbl_certificates WHERE employee_id = p_employee_id;
END;
$$;
-- rollback DROP PROCEDURE sp_delete_employee_certificates(UUID);