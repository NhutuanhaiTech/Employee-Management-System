package com.example.qlnv.dto.auth.request;

import com.example.qlnv.constant.UserConstants;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class SignUpRequestDto {

    @NotBlank(message = UserConstants.MSG_USERNAME_BLANK)
    @Size(min = 4, max = 50, message = UserConstants.MSG_USERNAME_SIZE)
    private String username;

    @NotBlank(message = UserConstants.MSG_PASSWORD_BLANK)
    @Size(min = 6, max = 100, message = UserConstants.MSG_PASSWORD_SIZE)
    private String password;

    @NotBlank(message = UserConstants.MSG_CONFIRM_PASSWORD_BLANK)
    private String confirmPassword;

    @NotBlank(message = UserConstants.MSG_EMAIL_BLANK)
    @Email(message = UserConstants.MSG_EMAIL_INVALID)
    @Size(max = 100, message = UserConstants.MSG_EMAIL_SIZE)
    private String email;

    @NotBlank(message = UserConstants.MSG_PHONE_BLANK)
    @Pattern(regexp = UserConstants.REGEX_PHONE_VN , message = UserConstants.MSG_PHONE_INVALID)
    private String phone;

    @NotBlank(message = UserConstants.MSG_FULLNAME_BLANK)
    @Size(min = 2, max = 100, message = UserConstants.MSG_FULLNAME_SIZE)
    private String fullName;

    @NotNull(message = UserConstants.MEG_POSITION_ID_NULL)
    private UUID positionId;

    @NotEmpty(message = UserConstants.MSG_LIST_ROLES_NULL)
    private List<@NotNull UUID> listRoles;
}