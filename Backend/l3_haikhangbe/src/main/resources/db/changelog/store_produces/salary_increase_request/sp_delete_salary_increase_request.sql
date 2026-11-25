-- liquibase formatted sql

-- changeset khang:sp_delete_salary_increase_request splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_delete_salary_increase_request(
    p_id UUID,
    p_submitter_username VARCHAR,
    p_allowed_statuses VARCHAR[]
)
LANGUAGE plpgsql
AS $$
DECLARE
v_status VARCHAR(50);
    v_employee_created_by VARCHAR;
BEGIN

SELECT r.status, e.created_by
INTO v_status, v_employee_created_by
FROM tbl_salary_increase_requests r
         JOIN tbl_employees e ON r.employee_id = e.id
WHERE r.id = p_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy bản ghi đề xuất tăng lương.';
END IF;

    IF v_employee_created_by != p_submitter_username THEN
        RAISE EXCEPTION 'Lỗi: Bạn không có quyền xóa đơn. Chỉ người tạo hồ sơ (Người tạo: %) mới được phép thao tác.', v_employee_created_by;
END IF;

    IF v_status != ALL(p_allowed_statuses) THEN
        RAISE EXCEPTION 'Lỗi: Chỉ được phép xóa đơn đề xuất ở trạng thái Lưu mới.';
END IF;

DELETE FROM tbl_salary_increase_decisions
WHERE request_id = p_id;

DELETE FROM tbl_salary_increase_requests
WHERE id = p_id;
END;
$$;
-- rollback DROP PROCEDURE sp_delete_salary_increase_request(UUID, VARCHAR, VARCHAR[]);