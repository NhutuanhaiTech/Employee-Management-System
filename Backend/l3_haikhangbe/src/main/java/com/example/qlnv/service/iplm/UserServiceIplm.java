package com.example.qlnv.service.iplm;

import com.example.qlnv.constant.UserConstants;
import com.example.qlnv.dto.BasePageRequestDto;
import com.example.qlnv.dto.user.reponse.UserByRoleResponseDto;
import com.example.qlnv.repository.UserRepository;
import com.example.qlnv.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class UserServiceIplm implements UserService {
    @Autowired
    private UserRepository userRepos;

    @Override
    public boolean checkEmailExist(String email) {
        return userRepos.checkEmailExist(email);
    }

    @Override
    public boolean checkUserNameExist(String username) {
        return userRepos.checkUsernameExist(username);
    }

    @Override
    public UUID createNewUser(String userJson) {
        return this.userRepos.createNewUser(userJson);
    }

    @Override
    public String getAllUsers(BasePageRequestDto dto) {
       return this.userRepos.callSpGetAllUsers(dto.getPage(), dto.getSize());
    }

    @Transactional()
    @Override
    public List<UserByRoleResponseDto> getLeadersByRole(String roleName) {
        if (roleName == null || roleName.trim().isEmpty()) {
            throw new IllegalArgumentException(UserConstants.MEG_ROLE_BLANK);
        }
        return userRepos.getLeadersByRole(roleName.trim().toUpperCase());
    }
}
