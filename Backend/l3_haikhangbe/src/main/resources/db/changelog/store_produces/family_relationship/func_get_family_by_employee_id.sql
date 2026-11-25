-- liquibase formatted sql

-- changeset khang:func_get_family_relationships_by_employee_id splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_get_family_relationships_by_employee_id(
    p_employee_id UUID
)
RETURNS TABLE (
    id UUID,
    full_name VARCHAR,
    relationship_type VARCHAR,
    gender VARCHAR,
    dob DATE,
    id_number VARCHAR,
    address VARCHAR,
    phone VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    f.id,
    f.full_name,
    f.relationship_type,
    f.gender,
    f.dob,
    f.id_number,
    f.address,
    f.phone
FROM tbl_family_relationships f
WHERE f.employee_id = p_employee_id;
END;
$$;

-- rollback DROP FUNCTION func_get_family_relationships_by_employee_id(UUID);