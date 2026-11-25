package com.example.qlnv.service;

import com.example.qlnv.dto.BasePageRequestDto;
import com.example.qlnv.dto.user.reponse.UserByRoleResponseDto;

import java.util.List;
import java.util.UUID;

public interface UserService {
    boolean checkUserNameExist(String username);
    boolean checkEmailExist(String email);
    UUID createNewUser(String userJson);
    String getAllUsers(BasePageRequestDto dto);
    List<UserByRoleResponseDto> getLeadersByRole(String roleName);
}
