package com.example.qlnv.service;

import com.example.qlnv.dto.auth.request.LoginRequestDto;
import com.example.qlnv.dto.auth.response.LoginResponseDto;
import com.example.qlnv.dto.auth.request.SignUpRequestDto;

import java.util.UUID;

public interface AuthService {
    UUID signUp(SignUpRequestDto dto);
    LoginResponseDto login(LoginRequestDto request);
}
