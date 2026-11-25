-- liquibase formatted sql

-- changeset khang:create_func_get_all_teams runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION get_all_teams()
RETURNS TABLE (
    id UUID,
    team_name VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    t.id,
    t.team_name
FROM tbl_teams t
ORDER BY t.team_name ASC; -- Nên sắp xếp theo tên phòng ban (A-Z) để dễ tìm kiếm trên UI
END;
$$;
-- rollback DROP FUNCTION IF EXISTS get_all_teams();