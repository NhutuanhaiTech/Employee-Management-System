-- liquibase formatted sql
-- changeset khang:create_sp_check_phone_exist splitStatements:false runOnChange:true

CREATE OR REPLACE FUNCTION check_phone_exist(p_phone VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
    BEGIN
        RETURN EXISTS(SELECT 1 FROM tbl_users WHERE phone = p_phone);
    END;
$$;
-- rollback DROP FUNCTION IF EXISTS check_phone_exist(VARCHAR);