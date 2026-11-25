-- liquibase formatted sql

-- changeset khang:create_sp_check_exist_email splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION check_email_exist(p_email VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
    BEGIN
        RETURN EXISTS(SELECT 1 FROM tbl_users WHERE email = p_email);
    END;
$$;
-- rollback DROP FUNCTION IF EXISTS check_email_exist(VARCHAR);