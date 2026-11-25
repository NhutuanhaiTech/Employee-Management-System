-- liquibase formatted sql
-- changeset khang:sp_insert_family_relationships splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_insert_family_relationships(
    p_employee_id UUID,
    p_family_relationships jsonb,
    p_total_family INT
)
LANGUAGE plpgsql
AS $$
DECLARE
v_total INT;
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM tbl_employees WHERE id = p_employee_id
    ) THEN
        RAISE EXCEPTION 'Lỗi: Nhân viên không tồn tại trong hệ thống.';
END IF;

SELECT COUNT(*) INTO v_total FROM jsonb_array_elements(p_family_relationships);
IF (v_total > p_total_family) THEN
        RAISE EXCEPTION 'Lỗi: Số lượng người thân khai báo không được vượt quá tối đa % người', p_total_family;
END IF;


    IF EXISTS (
        SELECT 1
        FROM jsonb_array_elements(p_family_relationships) AS fr
        WHERE fr ->> 'idNumber' IS NOT NULL AND TRIM(fr ->> 'idNumber') <> ''
        GROUP BY fr ->> 'idNumber'
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Lỗi: Có CCCD/CMND (idNumber) bị trùng lặp trong danh sách người thân gửi lên.';
END IF;

    IF EXISTS (
        SELECT 1
        FROM jsonb_array_elements(p_family_relationships) AS fr
        WHERE fr ->> 'phone' IS NOT NULL AND TRIM(fr ->> 'phone') <> ''
        GROUP BY fr ->> 'phone'
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Lỗi: Có số điện thoại (phone) bị trùng lặp trong danh sách người thân gửi lên.';
END IF;


    IF EXISTS (
        SELECT 1
        FROM jsonb_array_elements(p_family_relationships) AS fr
        WHERE fr ->> 'relationshipType' IS NOT NULL AND TRIM(fr ->> 'relationshipType') <> ''
        GROUP BY LOWER(TRIM(fr ->> 'relationshipType'))
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Lỗi: Có loại mối quan hệ bị trùng lặp. Mỗi loại quan hệ chỉ được khai báo một lần.';
END IF;

DELETE FROM tbl_family_relationships WHERE employee_id = p_employee_id;

IF p_family_relationships IS NOT NULL AND jsonb_typeof(p_family_relationships) = 'array' AND jsonb_array_length(p_family_relationships) > 0 THEN
        INSERT INTO tbl_family_relationships (
            employee_id, full_name, gender, dob, id_number, relationship_type, address, phone
        )
SELECT
    p_employee_id,
    fr ->> 'fullName',
    fr ->> 'gender',
    NULLIF(fr ->> 'dob', '')::DATE,
    fr ->> 'idNumber',
    fr ->> 'relationshipType',
    fr ->> 'address',
    fr ->> 'phone'
FROM jsonb_array_elements(p_family_relationships) AS fr;
END IF;

END;
$$;
-- rollback DROP PROCEDURE sp_insert_family_relationships(UUID, jsonb, INT);