package com.example.qlnv.dto.user.reponse;

import lombok.Data;

import java.util.UUID;

@Data
public class UserResponseDto {
    private UUID id;
    private String username;
    private String email;
    private String phone;
    private String fullName;
}
