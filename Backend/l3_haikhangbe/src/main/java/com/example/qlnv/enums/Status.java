package com.example.qlnv.enums;

public enum Status {
    DRAFT("Lưu mới"),
    UPDATE_REQUIRED("Yêu cầu cập nhật"),
    REJECTED("Từ chối"),
    PENDING("Chờ duyệt"),
    APPROVED("Đã duyệt"),
    TERMINATION_DRAFT("Lưu mới kết thúc"),
    TERMINATION_PENDING("Chờ duyệt kết thúc"),
    TERMINATION_UPDATE_REQUIRED("Yêu cầu bổ sung kết thúc"),
    TERMINATED("Đã kết thúc"),
    ARCHIVED("Nộp lưu");

    private final String description;

    Status(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}