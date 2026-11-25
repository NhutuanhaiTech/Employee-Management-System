package com.example.qlnv.dto.user.request;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UserSignUpJsonPayload {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String fullName;
    private UUID positionId;
    private List<UUID> listRoles;
}
