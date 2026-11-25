-- liquibase formatted sql

-- changeset khang:create_table_tbl_approval_requests
CREATE TABLE tbl_approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    submitter_id UUID NOT NULL,
    leader_id UUID,
    submit_date DATE NOT NULL,
    submit_content TEXT,
    status VARCHAR(50) NOT NULL CHECK (
        status IN (
            'UPDATE_REQUIRED',
            'REJECTED',
            'PENDING',
            'APPROVED'
        )),
    is_qualified BOOLEAN NOT NULL DEFAULT FALSE,
    appointment_date DATE,
    feed_back TEXT,
    feed_back_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES tbl_employees(id),
    FOREIGN KEY (submitter_id) REFERENCES tbl_users(id),
    FOREIGN KEY (leader_id) REFERENCES tbl_users(id)
);

-- rollback drop table tbl_approval_requests;