-- liquibase formatted sql

-- changeset khang:create_table_tbl_certificates
CREATE TABLE tbl_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    content TEXT NOT NULL,
    field VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES tbl_employees(id)
);
-- rollback drop table tbl_certificates;