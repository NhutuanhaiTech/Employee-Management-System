-- liquibase formatted sql
-- changeset khang:create_table_tbl_employees
CREATE TABLE tbl_teams(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
)
-- rollback drop table tbl_teams;
