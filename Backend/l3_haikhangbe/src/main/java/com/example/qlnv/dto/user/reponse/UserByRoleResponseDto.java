package com.example.qlnv.dto.user.reponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserByRoleResponseDto {
    private UUID id;
    private String fullName;
    private String positionName;
}