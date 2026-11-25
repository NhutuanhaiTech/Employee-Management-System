-- liquibase formatted sql
-- changeset khang:create_tbl_user_role
CREATE TABLE  tbl_user_role (
    id_user UUID NOT NULL,
    id_role UUID NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_role),
    FOREIGN KEY (id_user) REFERENCES tbl_users(id),
    FOREIGN KEY (id_role) REFERENCES tbl_roles(id)
)
--rollback drop table tbl_user_role;