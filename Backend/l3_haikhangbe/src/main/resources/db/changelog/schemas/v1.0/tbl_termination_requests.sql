-- liquibase formatted sql

-- changeset khang:create_table_termination_requests
CREATE TABLE tbl_termination_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    submitter_id UUID NOT NULL,

    submit_date DATE,
    leader_id UUID,
    submit_note TEXT,

    leader_feedback TEXT,
    decision_date DATE,

    status VARCHAR(50) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
-- rollback DROP TABLE tbl_termination_requests;