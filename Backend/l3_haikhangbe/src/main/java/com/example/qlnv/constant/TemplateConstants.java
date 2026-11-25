package com.example.qlnv.constant;

public final class TemplateConstants {

    private TemplateConstants() {}

    public static final String FORM_TYPE_SO_YEU_LY_LICH = "SO_YEU_LY_LICH";
    public static final String FORM_TYPE_DON_DANG_KI = "DON_DANG_KI";
    public static final String FORM_TYPE_BAO_CAO_DE_XUAT = "BAO_CAO_DE_XUAT";

    public static final int MIN_REQUIRED_TEMPLATES = 3;
    public static final int MAX_LENGTH_COMMENT = 1000;

    public static final String FORM_TYPE_REGEX = "^(" +
            FORM_TYPE_SO_YEU_LY_LICH + "|" +
            FORM_TYPE_DON_DANG_KI + "|" +
            FORM_TYPE_BAO_CAO_DE_XUAT + ")$";

    public static final String MSG_GET_SUCCESS = "lấy danh sách biểu mẫu thành công";
    public static final String MSG_UPDATE_SUCCES = "Cập nhật biểu mẫu thành công";
    public static final String MSG_INSERT_SUCCESS = "Tạo biểu mẫu thành công";

    public static final String MSG_EMPLOYEE_ID_NOT_NULL = "ID nhân viên không được để trống";
    public static final String MSG_FORM_TYPE_NOT_BLANK = "Loại biểu mẫu không được để trống";
    public static final String MSG_FORM_TYPE_INVALID = "Loại biểu mẫu không hợp lệ. Chỉ chấp nhận: " +
            FORM_TYPE_SO_YEU_LY_LICH + ", " +
            FORM_TYPE_DON_DANG_KI + ", " +
            FORM_TYPE_BAO_CAO_DE_XUAT;

    public static final String MSG_FORM_DATA_NOT_NULL = "Dữ liệu biểu mẫu (form_data) không được để trống";
    public static final String MSG_FORM_DATA_NOT_EMPTY = "Dữ liệu biểu mẫu (formData) phải chứa ít nhất một trường dữ liệu.";

    public static final String MSG_COMMENT_NOT_BLANK = "Ý kiến phê duyệt của lãnh đạo không được để trống";
    public static final String MSG_COMMENT_SIZE = "Ý kiến phê duyệt không được vượt quá " + MAX_LENGTH_COMMENT + " ký tự";
}