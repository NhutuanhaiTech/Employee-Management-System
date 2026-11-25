package com.example.qlnv.constant;

public final class EmployeeConstants {
    public static final int LENGTH_CODE = 10;
    public static final int MAX_LENGTH_NAME = 255;
    public static final int MAX_LENGTH_FULL_NAME = 100;
    public static final int MIN_LENGTH_NAME = 2;
    public static final int MAX_LENGTH_GENDER = 20;
    public static final int MAX_LENGTH_ADDRESS = 255;
    public static final int MAX_LENGTH_ID_NUMBER = 50;
    public static final int MAX_LENGTH_PHONE = 20;
    public static final int MAX_LENGTH_EMAIL = 100;
    public static final int MAX_LENGTH_AVATAR_URL = 500;

    public static final int MIN_LENGTH_CERT_NAME = 2;
    public static final int MAX_LENGTH_CERT_NAME = 150;
    public static final int MAX_LENGTH_CERT_CONTENT = 500;
    public static final int MAX_LENGTH_CERT_FIELD = 100;

    public static final String REGEX_GENDER = "^(?i)(MALE|FEMALE|OTHER)$";
    public static final String REGEX_ID_NUMBER = "^(\\d{9}|\\d{12})$";
    public static final String REGEX_PHONE_VN = "^(0|\\+84)(3|5|7|8|9)[0-9]{8}$";

    public static final String VAL_CODE_NOT_BLANK = "Mã nhân viên không được để trống";
    public static final String VAL_CODE_SIZE = "Mã nhân viên phải có " + LENGTH_CODE + " ký tự";

    public static final String VAL_NAME_NOT_BLANK = "Họ tên không được để trống";
    public static final String VAL_NAME_SIZE = "Họ tên phải từ " + MIN_LENGTH_NAME + " đến " + MAX_LENGTH_FULL_NAME + " ký tự";

    public static final String VAL_GENDER_NOT_BLANK = "Giới tính không được để trống";
    public static final String VAL_GENDER_SIZE = "Giới tính không được vượt quá " + MAX_LENGTH_GENDER + " ký tự";
    public static final String VAL_GENDER_PATTERN = "Giới tính phải là MALE, FEMALE hoặc OTHER (không phân biệt hoa/thường)";

    public static final String VAL_DOB_NOT_NULL = "Ngày sinh không được để trống";
    public static final String VAL_DOB_PAST = "Ngày sinh phải là một ngày trong quá khứ";

    public static final String VAL_ADDRESS_NOT_BLANK = "Địa chỉ không được để trống";
    public static final String VAL_ADDRESS_SIZE = "Địa chỉ không được vượt quá " + MAX_LENGTH_ADDRESS + " ký tự";

    public static final String VAL_AVATAR_URL_INVALID = "Đường dẫn ảnh đại diện không hợp lệ";
    public static final String VAL_AVATAR_URL_SIZE = "Đường dẫn ảnh quá dài";

    public static final String VAL_ID_NUMBER_NOT_BLANK = "Số CMND/CCCD không được để trống";
    public static final String VAL_ID_NUMBER_SIZE = "CMND/CCCD không được vượt quá " + MAX_LENGTH_ID_NUMBER + " ký tự";
    public static final String VAL_ID_NUMBER_PATTERN = "Số CMND/CCCD phải bao gồm 9 hoặc 12 chữ số hợp lệ";

    public static final String VAL_PHONE_NOT_BLANK = "Số điện thoại không được để trống";
    public static final String VAL_PHONE_SIZE = "Số điện thoại không được vượt quá " + MAX_LENGTH_PHONE + " ký tự";
    public static final String VAL_PHONE_PATTERN = "Số điện thoại không đúng định dạng nhà mạng Việt Nam";

    public static final String VAL_EMAIL_NOT_BLANK = "Địa chỉ Email không được để trống";
    public static final String VAL_EMAIL_INVALID = "Email không đúng định dạng";
    public static final String VAL_EMAIL_SIZE = "Email không được vượt quá " + MAX_LENGTH_EMAIL + " ký tự";

    public static final String VAL_TEAM_ID_NOT_NULL = "Team ID không được để trống";

    public static final String VAL_STATUS_NOT_BLANK = "Trạng thái không được để trống";
    public static final String VAL_STATUS_INVALID = "Trạng thái phải là DRAFT, UPDATE_REQUIRED, REJECTED, PENDING, hoặc APPROVED";

    public static final String VAL_FAMILY_NAME_NOT_BLANK = "Họ và tên người thân không được để trống";
    public static final String VAL_FAMILY_NAME_SIZE = "Họ và tên phải từ " + MIN_LENGTH_NAME + " đến " + MAX_LENGTH_FULL_NAME + " ký tự";
    public static final String VAL_FAMILY_GENDER_PATTERN = "Giới tính chỉ được là MALE, FEMALE hoặc OTHER";
    public static final String VAL_RELATIONSHIP_NOT_NULL = "Mối quan hệ không được để trống";

    public static final String VAL_CERT_NAME_NOT_BLANK = "Tên chứng chỉ không được để trống";
    public static final String VAL_CERT_NAME_SIZE = "Tên chứng chỉ phải từ " + MIN_LENGTH_CERT_NAME + " đến " + MAX_LENGTH_CERT_NAME + " ký tự";
    public static final String VAL_CERT_START_DATE_NOT_NULL = "Ngày bắt đầu (cấp chứng chỉ) không được để trống";
    public static final String VAL_CERT_START_DATE_PAST_PRESENT = "Ngày bắt đầu phải là ngày trong quá khứ hoặc hiện tại";
    public static final String VAL_CERT_CONTENT_NOT_BLANK = "Nội dung/mô tả chứng chỉ không được để trống";
    public static final String VAL_CERT_CONTENT_SIZE = "Nội dung chứng chỉ không được vượt quá " + MAX_LENGTH_CERT_CONTENT + " ký tự";
    public static final String VAL_CERT_FIELD_NOT_BLANK = "Lĩnh vực không được để trống";
    public static final String VAL_CERT_FIELD_SIZE = "Lĩnh vực không được vượt quá " + MAX_LENGTH_CERT_FIELD + " ký tự";

    public static final String MES_CREATE_NEW_EMPLOYEE_SUCCESS = "Thêm mới nhân viên thành công";
    public static final String MES_UPDATE_NEW_EMPLOYEE_SUCCESS = "Cập nhật nhân viên thành công";
    public static final String MES_DELETE_EMPLOYEE_SUCCESS = "Xóa thông tin nhân viên thành công";
    public static final String MES_GET_ALL_EMPLOYEES = "lấy danh sách nhân viên thành công";

    private EmployeeConstants() {}
}