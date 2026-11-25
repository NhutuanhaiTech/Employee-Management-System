-- liquibase formatted sql
-- changeset khang:sp_insert_certificates splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_insert_certificates(
    p_employee_id UUID,
    p_certificates jsonb,
    p_max_total INT,
    p_max_feld INT

)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_certificates IS NOT NULL AND jsonb_typeof(p_certificates) = 'array' AND jsonb_array_length(p_certificates) > 0 THEN

        IF jsonb_array_length(p_certificates) > p_max_total THEN
            RAISE EXCEPTION 'Lỗi: Tổng số lượng chứng chỉ không được vượt quá 5.';
END IF;

        IF EXISTS (
            SELECT 1
            FROM jsonb_array_elements(p_certificates) AS cert
            GROUP BY cert->>'field', cert->>'name'
            HAVING COUNT(*) >= 2
        ) THEN
            RAISE EXCEPTION 'Lỗi: Không được phép có 2 chứng chỉ trùng lặp cả tên và lĩnh vực.';
END IF;

        IF EXISTS (
            SELECT 1
            FROM jsonb_array_elements(p_certificates) AS cert
            GROUP BY cert->>'field'
            HAVING COUNT(*) >= p_max_feld
        ) THEN
            RAISE EXCEPTION 'Lỗi: Hồ sơ không hợp lệ. Có từ 3 văn bằng/chứng chỉ trở lên thuộc cùng một lĩnh vực.';
END IF;

END IF;

DELETE FROM tbl_certificates WHERE employee_id = p_employee_id;

IF p_certificates IS NOT NULL AND jsonb_typeof(p_certificates) = 'array' AND jsonb_array_length(p_certificates) > 0 THEN
        INSERT INTO tbl_certificates (employee_id, name, start_date, content, field)
SELECT
    p_employee_id,
    cert ->> 'name',
    NULLIF(cert ->> 'startDate', '')::DATE,
    cert ->> 'content',
    cert ->> 'field'
FROM jsonb_array_elements(p_certificates) AS cert;
END IF;
END;
$$;

-- rollback DROP PROCEDURE sp_insert_certificates(UUID, jsonb);