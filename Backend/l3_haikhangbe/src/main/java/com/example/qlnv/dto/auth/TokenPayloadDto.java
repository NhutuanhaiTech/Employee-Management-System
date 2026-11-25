package com.example.qlnv.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenPayloadDto {
    private UUID id;
    private String username;
    private String fullName;
    private String positionName;
    private List<String> roles = new ArrayList<>();
    public void addRole(String role) {
        if (role != null && !this.roles.contains(role)) {
            this.roles.add(role);
        }
    }
}