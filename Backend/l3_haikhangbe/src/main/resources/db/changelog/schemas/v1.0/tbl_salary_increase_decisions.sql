-- changeset khang:create_tbl_salary_increase_decisions
CREATE TABLE tbl_salary_increase_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL,
    decision_number VARCHAR(100) NOT NULL,
    effective_date DATE NOT NULL,
    decision_content TEXT NOT NULL,

    leader_comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (request_id) REFERENCES tbl_salary_increase_requests(id) ON DELETE CASCADE
);
-- rollback drop table tbl_salary_increase_decisions;