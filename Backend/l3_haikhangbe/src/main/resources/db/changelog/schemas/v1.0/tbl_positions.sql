-- liquibase formatted sql

-- changeset khang:create_tbl_positions_table
CREATE TABLE tbl_positions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            position_name VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
);
-- rollback drop table tbl_positions;