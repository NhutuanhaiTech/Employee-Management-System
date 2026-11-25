-- liquibase formatted sql
-- changeset khang:create_sign_up_sp splitStatements:false runOnChange:true
CREATE OR REPLACE FUNCTION func_create_new_user(
    p_user_json JSONB
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
new_user_id UUID;
    v_username varchar;
    v_password varchar;
    v_email varchar;
    v_phone varchar;
    v_full_name varchar;
    v_pos_id UUID;
    v_roles UUID[];
BEGIN
    v_username  := p_user_json->>'username';
    v_password  := p_user_json->>'password';
    v_email     := p_user_json->>'email';
    v_phone     := p_user_json->>'phone';
    v_full_name := p_user_json->>'fullName';
    v_pos_id    := (p_user_json->>'positionId')::UUID;

    IF jsonb_typeof(p_user_json->'listRoles') = 'array' THEN
SELECT ARRAY(
           SELECT jsonb_array_elements_text(p_user_json->'listRoles')::UUID
        ) INTO v_roles;
ELSE
        v_roles := '{}';
END IF;

    IF NOT EXISTS (SELECT 1 FROM tbl_positions WHERE id = v_pos_id) THEN
       RAISE EXCEPTION 'Lỗi : id_positions % vị trí chức vụ không tìm thấy trong bảng tbl_positions', v_pos_id;
END IF;

    IF array_length(v_roles, 1) > 0 THEN
        IF EXISTS (
            SELECT 1 FROM unnest(v_roles) AS role_id
            WHERE NOT EXISTS(SELECT 1 FROM tbl_roles WHERE id = role_id)
        ) THEN
           RAISE EXCEPTION 'id role không tồn tại';
END IF;
END IF;

INSERT INTO tbl_users(username, password, email, phone, full_name, positions_id)
VALUES (v_username, v_password, v_email, v_phone, v_full_name, v_pos_id)
    RETURNING id INTO new_user_id;

IF array_length(v_roles, 1) > 0 THEN
        INSERT INTO tbl_user_role(id_user, id_role)
SELECT new_user_id, unnest(v_roles);
END IF;

RETURN new_user_id;

END;
$$;

-- rollback DROP FUNCTION create_new_user(JSONB);