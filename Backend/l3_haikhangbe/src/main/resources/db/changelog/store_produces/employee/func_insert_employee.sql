-- liquibase formatted sql
-- changeset khang:func_insert_employee splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_insert_employee(
    p_employee_data jsonb,
    p_status VARCHAR
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
v_employee_id UUID;
    v_team_id UUID := NULLIF(p_employee_data ->> 'teamId', '')::UUID;
BEGIN
    IF v_team_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM tbl_teams WHERE id = v_team_id) THEN
        RAISE EXCEPTION 'Không tồn tại teamId: %', v_team_id;
END IF;

INSERT INTO tbl_employees (
    employee_code, full_name, gender, dob, address, avatar_url,
    id_number, phone, email, team_id, status, created_by
)
VALUES (
           p_employee_data ->> 'employeeCode',
           p_employee_data ->> 'fullName',
           p_employee_data ->> 'gender',
           NULLIF(p_employee_data ->> 'dob', '')::DATE,
           p_employee_data ->> 'address',
           p_employee_data ->> 'avatarUrl',
           p_employee_data ->> 'idNumber',
           p_employee_data ->> 'phone',
           p_employee_data ->> 'email',
           v_team_id,
           p_status,
           p_employee_data ->> 'createBy'
       ) RETURNING id INTO v_employee_id;

RETURN v_employee_id;

EXCEPTION
    WHEN unique_violation THEN
        IF SQLERRM LIKE '%employee_code%' THEN
            RAISE EXCEPTION 'Mã nhân viên (employeeCode) đã tồn tại.';
        ELSIF SQLERRM LIKE '%id_number%' THEN
            RAISE EXCEPTION 'Số CMND/CCCD (idNumber) đã tồn tại.';
        ELSIF SQLERRM LIKE '%email%' THEN
            RAISE EXCEPTION 'Email đã tồn tại.';
ELSE
            RAISE EXCEPTION 'Dữ liệu bị trùng lặp: %', SQLERRM;
END IF;
END;
$$;
-- rollback DROP FUNCTION func_insert_employee(jsonb, VARCHAR);