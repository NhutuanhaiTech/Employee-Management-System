-- liquibase formatted sql

-- changeset khang:create_tbl_roles_table

CREATE TABLE tbl_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- rollback DROP TABLE tbl_roles;