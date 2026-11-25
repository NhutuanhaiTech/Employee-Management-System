-- changeset khang:sp_delete_employee splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_delete_employee(
    p_employee_id UUID,
    p_username VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
v_status VARCHAR;
BEGIN
SELECT status INTO v_status FROM tbl_employees WHERE id = p_employee_id;

IF v_status IS NULL THEN        
        RAISE EXCEPTION 'Không tìm thấy nhân viên với ID: %', p_employee_id;
END IF;

    IF v_status != 'DRAFT' THEN
        RAISE EXCEPTION 'Chỉ có trạng thái lưu mới (DRAFT) mới được phép xóa';
END IF;

    IF NOT EXISTS (SELECT 1 FROM tbl_employees WHERE id = p_employee_id AND created_by = p_username) THEN
        RAISE EXCEPTION 'Chỉ có quản lý tạo nhân viên mới được phép xóa';
END IF;

DELETE FROM tbl_employees WHERE id = p_employee_id;
END;
$$;
-- rollback DROP PROCEDURE sp_delete_employee(UUID, VARCHAR);