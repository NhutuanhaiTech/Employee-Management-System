-- liquibase formatted sql
-- changeset khang:sp_update_employee splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_update_employee(
    p_employee_id UUID,
    p_employee_data jsonb,
    p_status VARCHAR DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
v_team_id UUID := NULLIF(p_employee_data ->> 'teamId', '')::UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tbl_employees WHERE id = p_employee_id) THEN
        RAISE EXCEPTION 'Không tìm thấy nhân viên với ID: %', p_employee_id;
    END IF;

    IF v_team_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM tbl_teams WHERE id = v_team_id) THEN
        RAISE EXCEPTION 'Không tồn tại teamId: %', v_team_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tbl_employees WHERE id = p_employee_id AND created_by = p_employee_data ->> 'updateBy') THEN
        RAISE EXCEPTION 'Bạn không có quyền chỉnh sửa. Chỉ người tạo mới được phép cập nhật.';
    END IF;

    IF NOT EXISTS (
    SELECT 1
    FROM tbl_employees
    WHERE id = p_employee_id
      AND status IN ('DRAFT', 'UPDATE_REQUIRED', 'REJECTED')
    ) THEN
    RAISE EXCEPTION 'Chỉ có thể chỉnh sửa hồ sơ khi đang ở trạng thái Lưu nháp hoặc Yêu cầu bổ sung.';
    END IF;

UPDATE tbl_employees
SET
    employee_code = p_employee_data ->> 'employeeCode',
    full_name = p_employee_data ->> 'fullName',
    gender = p_employee_data ->> 'gender',
    dob = NULLIF(p_employee_data ->> 'dob', '')::DATE,
    address = p_employee_data ->> 'address',
    avatar_url = p_employee_data ->> 'avatarUrl',
    id_number = p_employee_data ->> 'idNumber',
    phone = p_employee_data ->> 'phone',
    email = p_employee_data ->> 'email',
    team_id = v_team_id,
    status = COALESCE(p_status, status),
    updated_by = p_employee_data ->> 'updatedBy',
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_employee_id;

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
-- rollback DROP PROCEDURE sp_update_employee(UUID, jsonb, VARCHAR);