package com.example.qlnv.constant;

public final class SalaryRequestConstants {

    private SalaryRequestConstants() {
    }
    public static final String CREATE_SUCCESS = "Đơn đề xuất tăng lương đã được tạo thành công.";
    public static final String UPDATE_SUCCESS = "Cập nhật đơn đề xuất tăng lương thành công.";
    public static final String GET_HISTORY_SUCCESS = "Lấy lịch sử tăng lương thành công.";
    public static final String GET_DETAIL_SUCCESS = "Lấy thông tin theo id thành công.";

    public static final String EMPLOYEE_NOT_FOUND = "Không tìm thấy thông tin nhân viên.";
    public static final String EMPLOYEE_INACTIVE = "Nhân viên này đã nghỉ việc, không thể thao tác.";
    public static final String RECORD_NOT_FOUND = "Bản ghi tăng lương không tồn tại.";
    public static final String INVALID_STATUS_UPDATE = "Chỉ được chỉnh sửa khi trạng thái là Lưu mới hoặc Yêu cầu bổ sung.";

    public static final String EMPLOYEE_ID_REQUIRED = "ID nhân viên không được để trống.";
    public static final String INCREASE_TIMES_REQUIRED = "Lần tăng lương không được để trống.";
    public static final String INCREASE_TIMES_MIN = "Lần tăng lương phải lớn hơn hoặc bằng 1.";
    public static final String INCREASE_DATE_REQUIRED = "Ngày tăng lương không được để trống.";
    public static final String NEW_SALARY_LEVEL_REQUIRED = "Mức lương mới không được để trống.";
    public static final String NEW_SALARY_LEVEL_MAX_LENGTH = "Mức lương mới không được vượt quá 100 ký tự.";
    public static final String REASON_REQUIRED = "Lý do không được để trống.";
    public static final String DELETE_SUCCESS = "Xóa đề xuất tăng lương thành công";
    public static final String LEADER_ID_NOT_NULL = "Vui lòng chọn người phê duyệt (Leader ID).";
    public static final String SUBMIT_DATE_NOT_NULL = "Ngày trình duyệt không được để trống.";
    public static final String SUBMIT_SUCCESS = "submit thành công";
    public static final String GET_LIST_SALARY_REQUEST_SUCCESS = "Lấy danh sách yêu cầu tăng lương thành công";

    public static final String REQUEST_ID_REQUIRED = "ID yêu cầu không được để trống.";
    public static final String TARGET_STATUS_REQUIRED = "Trạng thái đích không được để trống.";
    public static final String FEEDBACK_DATE_REQUIRED = "Ngày phản hồi không được để trống.";
    public static final String RESPOND_SUCCESS = "Phản hồi thành công";

}