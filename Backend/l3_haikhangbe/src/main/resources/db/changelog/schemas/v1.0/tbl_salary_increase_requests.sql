-- liquibase formatted sql

-- changeset khang:create_tbl_salary_increase_requests runOnChange:true splitStatements:true
DROP TABLE IF EXISTS tbl_salary_increase_requests CASCADE;

CREATE TABLE tbl_salary_increase_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    submitter_id UUID NOT NULL,
    leader_id UUID,
    submit_date DATE,

    increase_date DATE NOT NULL ,
    increase_times INT NOT NULL DEFAULT 1,
    new_salary_level VARCHAR(100) NOT NULL,
    reason TEXT,
    note TEXT,

    status VARCHAR(50) NOT NULL,

    leader_feedback TEXT,
    feedback_date DATE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (employee_id) REFERENCES tbl_employees(id),
    FOREIGN KEY (submitter_id) REFERENCES tbl_users(id)
);
-- rollback drop table tbl_salary_increase_requests;