-- changeset khang:sp_delete_employee_family_relationships splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_delete_employee_family_relationships(
    p_employee_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
DELETE FROM tbl_family_relationships WHERE employee_id = p_employee_id;
END;
$$;
-- rollback DROP PROCEDURE sp_delete_employee_family_relationships(UUID);