-- liquibase formatted sql

-- changeset khang:sp_leader_comment_salary_increase_decision splitStatements:false runOnChange:true
CREATE OR REPLACE PROCEDURE sp_leader_comment_salary_increase_decision(
    p_id UUID,
    p_id_leader UUID,
    p_leader_comment TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tbl_salary_increase_decisions WHERE id = p_id) THEN
        RAISE EXCEPTION 'Lỗi: Không tìm thấy biểu mẫu quyết định tăng lương với id = %', p_id;
END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM tbl_salary_increase_decisions d
        JOIN tbl_salary_increase_requests r ON d.request_id = r.id
        WHERE d.id = p_id AND r.leader_id = p_id_leader
    ) THEN
        RAISE EXCEPTION 'Lỗi: Leader với id = % không có quyền hoặc không khớp với quyết định tăng lương này', p_id_leader;
END IF;

UPDATE tbl_salary_increase_decisions
SET
    leader_comment = p_leader_comment,
    updated_at = CURRENT_TIMESTAMP
WHERE id = p_id;

END;
$$;
-- rollback DROP PROCEDURE sp_leader_comment_salary_increase_decision(UUID, UUID, TEXT);