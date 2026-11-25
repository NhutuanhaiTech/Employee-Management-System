package com.example.qlnv.constant;

public final class UserConstants {
    private UserConstants() {}

    public static final String MSG_REGISTER_SUCCESS = "Đăng ký người dùng thành công!";
    public static final String MSG_UPDATE_SUCCESS = "Cập nhật thông tin người dùng thành công!";
    public static final String MSG_DELETE_SUCCESS ="Xóa người dùng thành công";
    public static final String MSG_LOGIN_SUCCESS = "Đăng nhập thành công";

    public static final String MSG_USER_NOT_FOUND = "Không tìm thấy người dùng!";

    public static final String MSG_USERNAME_EXIST = "Username đã tồn tại!";
    public static final String MSG_USERNAME_BLANK = "Username không được để trống";
    public static final String MSG_USERNAME_SIZE = "Tên đăng nhập phải từ 4 đến 50 ký tự";

    public static final String REGEX_PHONE_VN = "^(0|\\+84)[3|5|7|8|9][0-9]{8}$";

    public static final String MSG_PASSWORD_BLANK = "Mật khẩu không được để trống";
    public static final String MSG_PASSWORD_NOT_MATCH = "Mật khẩu nhập lại không khớp";
    public static final String MSG_PASSWORD_SIZE = "Mật khẩu phải từ 6 đến 100 ký tự";
    public static final String MSG_CONFIRM_PASSWORD_BLANK = "Mật khẩu xác nhận không được để trống";

    public static final String MSG_EMAIL_BLANK = "Email không được để trống";
    public static final String MSG_EMAIL_EXIST = "Email đã được sử dụng!";
    public static final String MSG_EMAIL_INVALID = "Email không đúng định dạng";
    public static final String MSG_EMAIL_SIZE = "Email không được vượt quá 100 ký tự";

    public static final String MSG_PHONE_BLANK = "Số điện thoại không được để trống";
    public static final String MSG_PHONE_INVALID = "Định dạng số điện thoại không hợp lệ";

    public static final String MSG_FULLNAME_BLANK = "Họ và tên không được để trống";
    public static final String MSG_FULLNAME_SIZE = "Họ và tên phải từ 2 đến 100 ký tự";

    public static final String MSG_ACCOUNT_NOT_EXIST = "Tài khoản không tồn tại";
    public static final String MSG_PASSWORD_INVALID = "Mật khẩu không chính xác";
    public static final String MSG_ROLE_USER_EXIST = "user đã được gán role này";
    public static final String MEG_USER_ID_BLANK = "id user không được bỏ trống";
    public static final String MEG_ROLE_ID_BLANK = "id role không được bỏ trống";
    public static final String MEG_POSITION_ID_NULL = "id position không được bỏ trống";
    public static final String MSG_LIST_ROLES_NULL = "danh sách role không được để trống";
    public static final String MEG_ADD_ROLE_USER_SUCCESS = "thêm role cho người dùng thành công";
    public static final String MEG_GET_USER_BY_ROLE = "Lấy danh sách người dùng theo role thành công";
    public static final String MEG_ROLE_BLANK = "thêm role cho người dùng thành công";
}