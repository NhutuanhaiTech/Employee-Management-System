package com.example.qlnv.enums;

public enum RequestStatus {
    DRAFT("Lưu mới"),
    UPDATE_REQUIRED("Yêu cầu cập nhật"),
    REJECTED("Từ chối"),
    PENDING("Chờ duyệt"),
    APPROVED("Đã duyệt"),;

    private final String description;

    RequestStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}