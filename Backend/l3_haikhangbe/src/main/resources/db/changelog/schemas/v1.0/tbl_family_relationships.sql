-- liquibase formatted sql

-- changeset khang:create_table_tbl_family_relationships
CREATE TABLE tbl_family_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    id_number VARCHAR(50) NOT NULL ,
    relationship_type VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES tbl_employees(id),
    CHECK (relationship_type IN ('FATHER','MOTHER','SPOUSE','CHILD','SIBLING'))
);
--rollback drop table tbl_family_relationships;