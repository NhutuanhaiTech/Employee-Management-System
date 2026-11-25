package com.example.qlnv.validate;

import com.example.qlnv.constant.UserConstants;
import com.example.qlnv.dto.auth.request.SignUpRequestDto;
import com.example.qlnv.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class AuthValidate {
    @Autowired
    private UserService userSv;

    public void signUpValidator(SignUpRequestDto dto) {
        this.validateEmail(dto.getEmail());
        this.validateUsername(dto.getUsername());
        this.validateConfirmPassword(dto.getPassword(), dto.getConfirmPassword());
    }

    private void validateUsername(String userName) {
       boolean isUserNameExist = userSv.checkUserNameExist(userName);
       if(isUserNameExist) {
           throw new IllegalArgumentException(UserConstants.MSG_USERNAME_EXIST);
       }
    }

    private void validateEmail(String email) {
       boolean isEmailExist = userSv.checkEmailExist(email);
       if(isEmailExist) {
           throw new IllegalArgumentException(UserConstants.MSG_EMAIL_EXIST);
       }
    }

    private void validateConfirmPassword(String password, String passwordConfirm) {
        if(!Objects.equals(password, passwordConfirm)) {
            throw new IllegalArgumentException(UserConstants.MSG_PASSWORD_NOT_MATCH);
        }
    }
}
