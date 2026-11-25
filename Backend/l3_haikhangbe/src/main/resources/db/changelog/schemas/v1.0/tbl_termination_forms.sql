-- liquibase formatted sql

-- changeset khang:create_table_termination_forms
CREATE TABLE tbl_termination_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL UNIQUE,

    end_date DATE,
    reason TEXT,

    to_department VARCHAR(255),
    subject VARCHAR(255),
    handover_content TEXT,

    leader_comment TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ,

FOREIGN KEY (request_id) REFERENCES tbl_termination_requests(id)
);
-- rollback DROP TABLE tbl_termination_forms;