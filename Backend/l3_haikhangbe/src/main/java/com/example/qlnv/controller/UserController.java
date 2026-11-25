package com.example.qlnv.controller;

import com.example.qlnv.constant.UserConstants;
import com.example.qlnv.dto.BasePageRequestDto;
import com.example.qlnv.dto.ResponseDto;
import com.example.qlnv.dto.user.reponse.UserByRoleResponseDto;
import com.example.qlnv.service.UserService;
import com.example.qlnv.utils.JsonUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/users")
public class UserController {
    private final UserService userSv;
    @Autowired
    public UserController(UserService userSv) {
        this.userSv = userSv;
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> getAllUsers(@Valid @ModelAttribute BasePageRequestDto dto) {
        return new ResponseEntity<>(JsonUtils.toObject(this.userSv.getAllUsers(dto)), HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, params = "roleName")
    public ResponseEntity<ResponseDto<List<UserByRoleResponseDto>>> fetchUserByRoleName(@RequestParam("roleName") String roleName) {
        List<UserByRoleResponseDto> response = this.userSv.getLeadersByRole(roleName);
        return new ResponseEntity<>(new ResponseDto<>(UserConstants.MEG_GET_USER_BY_ROLE, response), HttpStatus.OK);
    }
}
