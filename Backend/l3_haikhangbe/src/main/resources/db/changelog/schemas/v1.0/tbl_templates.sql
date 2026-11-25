-- liquibase formatted sql

-- changeset khang:create_table_tbl_files
CREATE TABLE tbl_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    form_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    form_data JSONB NOT NULL,
    leader_comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(50),
    FOREIGN KEY (employee_id) REFERENCES tbl_employees(id),
    CHECK ( form_type IN (
            'SO_YEU_LY_LICH',
            'DON_DANG_KI',
            'BAO_CAO_DE_XUAT'
        ) ),
    UNIQUE(employee_id, form_type)
);
--rollback drop table tbl_templates;