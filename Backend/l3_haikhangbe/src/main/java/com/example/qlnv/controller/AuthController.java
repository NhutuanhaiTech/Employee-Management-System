package com.example.qlnv.controller;

import com.example.qlnv.constant.UserConstants;
import com.example.qlnv.dto.auth.request.LoginRequestDto;
import com.example.qlnv.dto.auth.response.LoginResponseDto;
import com.example.qlnv.dto.auth.request.SignUpRequestDto;
import com.example.qlnv.dto.ResponseDto;
import com.example.qlnv.service.AuthService;
import com.example.qlnv.validate.AuthValidate;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping(value = "/api/auth")
public class AuthController {
    private final AuthService authService;
    private final AuthValidate authValidate;

    @Autowired
    public AuthController(AuthService authService, AuthValidate authValidate) {
        this.authService = authService;
        this.authValidate = authValidate;
    }

    @RequestMapping(value = "/sign-up",method = RequestMethod.POST)
    public ResponseEntity<ResponseDto<UUID>> signUp(@RequestBody @Valid SignUpRequestDto dto) {
        authValidate.signUpValidator(dto);
        UUID userId = this.authService.signUp(dto);
        return new ResponseEntity<>(
                new ResponseDto<>(UserConstants.MSG_REGISTER_SUCCESS, userId),
                HttpStatus.CREATED
        );
    }

    @RequestMapping(value = "/log-in", method = RequestMethod.POST)
    public ResponseEntity<LoginResponseDto> logIn(@RequestBody LoginRequestDto dto) {
            authService.login(dto);
            return new ResponseEntity<>(authService.login(dto), HttpStatus.OK);
    }
}
