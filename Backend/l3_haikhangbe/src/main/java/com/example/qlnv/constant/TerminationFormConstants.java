package com.example.qlnv.constant;

public class TerminationFormConstants {

    private TerminationFormConstants() {}

    public static final String MSG_CREATE_SUCCESS = "Tạo form nghỉ việc thành công";
    public static final String MSG_GET_SUCCESS = "Lấy thông tin form nghỉ việc thành công";
    public static final String MSG_UPDATE_SUCCESS = "Cập nhật form nghỉ việc thành công";
    public static final String MSG_DELETE_SUCCESS = "Xóa form nghỉ việc thành công";

    public static final String MSG_FORM_NOT_FOUND = "Không tìm thấy thông tin form nghỉ việc";
    public static final String MSG_STATUS_NOT_ALLOWED = "Trạng thái hiện tại không cho phép thực hiện thao tác này";
    public static final String MSG_UNAUTHORIZED_ACTION = "Bạn không có quyền thực hiện thao tác trên form này";

    public static final String VAL_END_DATE_NOT_NULL = "Ngày nghỉ dự kiến không được để trống";
    public static final String VAL_END_DATE_FUTURE = "Ngày nghỉ phải là ngày hôm nay hoặc trong tương lai";

    public static final String VAL_REASON_NOT_BLANK = "Lý do nghỉ việc không được để trống";
    public static final String VAL_REASON_SIZE = "Lý do nghỉ việc không được vượt quá 2000 ký tự";

    public static final String VAL_DEPT_NOT_BLANK = "Phòng ban tiếp nhận bàn giao không được để trống";
    public static final String VAL_DEPT_SIZE = "Tên phòng ban không được vượt quá 255 ký tự";

    public static final String VAL_SUBJECT_NOT_BLANK = "Tiêu đề bàn giao không được để trống";
    public static final String VAL_SUBJECT_SIZE = "Tiêu đề không được vượt quá 255 ký tự";

    public static final String VAL_HANDOVER_NOT_BLANK = "Nội dung bàn giao không được để trống";
    public static final String VAL_HANDOVER_SIZE = "Nội dung bàn giao không được vượt quá 5000 ký tự";
    public static final String MSG_UPDATE_COMMENT_SUCCESS = "Cập nhật ý kiến quản lý vào biểu mẫu thành công";
    public static final String VAL_LEADER_COMMENT_NOT_BLANK = "Ý kiến quản lý không được để trống";
}