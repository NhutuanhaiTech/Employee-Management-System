-- liquibase formatted sql
-- changeset khang:create_table_tbl_employees
CREATE TABLE tbl_employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK ( gender IN (
            'MALE',
            'FEMALE',
            'OTHER'
        ) ),
    dob DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    id_number VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE,
    team_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL CHECK ( status IN (
            'DRAFT',
            'UPDATE_REQUIRED',
            'REJECTED',
            'PENDING',
            'APPROVED',
            'TERMINATION_DRAFT',
            'TERMINATION_PENDING',
            'TERMINATION_UPDATE_REQUIRED',
            'TERMINATED',
            'ARCHIVED'
    ) ),
    is_work BOOLEAN NOT NULL DEFAULT FALSE,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES tbl_teams(id)
);
--rollback drop table tbl_employees;