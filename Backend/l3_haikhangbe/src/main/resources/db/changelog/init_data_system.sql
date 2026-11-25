-- liquibase formatted sql

-- changeset khang:v1.0.0_001_insert_data_default_roles
INSERT INTO tbl_roles (role)
VALUES
    ('ADMIN'),
    ('MANAGER'),
    ('LEADER');

INSERT INTO tbl_positions(position_name)
VALUES
    ('Giám Đốc'),
    ('Quản lý'),
    ('Trưởng phòng');

INSERT INTO tbl_teams (team_name)
VALUES
    ('Ban Giám đốc'),
    ('Phòng Hành chính Nhân sự'),
    ('Phòng Kế toán'),
    ('Phòng Công nghệ thông tin');

-- rollback DELETE FROM tbl_roles WHERE role IN ('ADMIN', 'MANAGER', 'LEADER');
-- rollback DELETE FROM tbl_positions WHERE position_name IN ('Giám Đốc', 'Quản lý', 'Trưởng phòng');
-- rollback DELETE FROM tbl_teams WHERE team_name IN ('Ban Giám đốc', 'Phòng Hành chính Nhân sự', 'Phòng Kế toán', 'Phòng Công nghệ thông tin');