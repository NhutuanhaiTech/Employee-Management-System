package com.example.qlnv.constant;

public final class SalaryIncreaseDecisionConstants {

    private SalaryIncreaseDecisionConstants() {
    }

    public static final String ERR_REQUEST_NOT_FOUND = "Lỗi: Đơn tăng lương (request_id = %s) không tồn tại trong hệ thống.";
    public static final String ERR_UNAUTHORIZED = "Lỗi: Bạn không có quyền thao tác. Chỉ người tạo hồ sơ (Người tạo: %s) mới được phép tạo quyết định tăng lương cho đơn này.";
    public static final String ERR_DECISION_ALREADY_EXISTS = "Lỗi: Đơn tăng lương này đã có biểu mẫu quyết định đính kèm. Không thể tạo thêm mà chỉ được phép cập nhật (Update).";
    public static final String VAL_REQUEST_ID_BLANK = "Mã đơn (requestId) không được để trống";
    public static final String VAL_SUBMITTER_USERNAME_BLANK = "Tên đăng nhập người gửi (submitterUsername) không được để trống";
    public static final String VAL_DECISION_NUMBER_BLANK = "Số quyết định (decisionNumber) không được để trống";
    public static final String VAL_SIGN_DATE_BLANK = "Ngày ký (signDate) không được để trống";
    public static final String VAL_EFFECTIVE_DATE_BLANK = "Ngày hiệu lực (effectiveDate) không được để trống";
    public static final String VAL_CONTENT_BLANK = "Nội dung (content) không được để trống";
    public static final String CREATE_SUCCESS = "Tạo biễu mẫu quyết định tăng lương thành công";
    public static final String UPDATE_SUCCESS = "Cập nhật quyết định tăng lương thành công";
    public static final String GET_DETAIL_SUCCESS = "Lấy thông tin quyết định tăng lương thành công";
    public static final String LEADER_COMMENT_NOT_BLANK = "Nhận xét của lãnh đạo không được để trống";
}
