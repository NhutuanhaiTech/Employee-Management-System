-- liquibase formatted sql

-- changeset khang:create_sp_check_exist_email splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION check_username_exist(p_username VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
    BEGIN
        RETURN EXISTS(SELECT 1 FROM tbl_users WHERE username = p_username);
    END;
$$;
-- rollback DROP FUNCTION IF EXISTS check_username_exist(VARCHAR);