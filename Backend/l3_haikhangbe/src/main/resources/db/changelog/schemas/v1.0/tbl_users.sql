-- liquibase formatted sql

-- changeset khang:create_tbl_users_table
CREATE TABLE tbl_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    positions_id UUID,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (positions_id) REFERENCES tbl_positions(id)
);
-- rollback drop table tbl_users;