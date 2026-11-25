package com.example.qlnv.service.iplm;

import com.example.qlnv.constant.UserConstants;
import com.example.qlnv.dto.auth.request.LoginRequestDto;
import com.example.qlnv.dto.auth.response.LoginResponseDto;
import com.example.qlnv.dto.auth.request.SignUpRequestDto;
import com.example.qlnv.dto.auth.TokenPayloadDto;
import com.example.qlnv.dto.user.reponse.UserAuthRowDto;
import com.example.qlnv.dto.user.request.UserSignUpJsonPayload;
import com.example.qlnv.mapper.UserMapper;
import com.example.qlnv.repository.UserRepository;
import com.example.qlnv.service.AuthService;
import com.example.qlnv.service.UserService;
import com.example.qlnv.utils.JsonUtils;
import com.example.qlnv.utils.JwtUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Transactional
@Service
public class AuthServiceIplm implements AuthService {
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final UserMapper userMapper;

    @Autowired
    public AuthServiceIplm(
            UserService userService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils,
            UserMapper userMapper
    ) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.userMapper = userMapper;
    }

    @Override
    public UUID signUp(SignUpRequestDto dto){
        String hashPw = passwordEncoder.encode(dto.getPassword());
        UserSignUpJsonPayload usp = userMapper.toUserJsonPayload(dto, hashPw);
        return userService.createNewUser(JsonUtils.toJsonString(usp));
    }

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        List<UserAuthRowDto> rows = userRepository.callSpGetUserByUsername(request.getUsername());
        if (rows == null || rows.isEmpty()) {
            throw new RuntimeException(UserConstants.MSG_ACCOUNT_NOT_EXIST);
        }
        if (!passwordEncoder.matches(request.getPassword(), rows.getFirst().getPassword())) {
            throw new RuntimeException(UserConstants.MSG_PASSWORD_INVALID);
        }

        TokenPayloadDto dto = userMapper.toTokenPayloadDto(rows);

        return new LoginResponseDto(UserConstants.MSG_LOGIN_SUCCESS, jwtUtils.generateToken(dto));
    }
}
