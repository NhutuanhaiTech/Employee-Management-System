package com.example.qlnv.dto.role.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponseDto {
    private UUID id;
    private String role;
}