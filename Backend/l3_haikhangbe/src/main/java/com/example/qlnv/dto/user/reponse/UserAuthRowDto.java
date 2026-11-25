package com.example.qlnv.dto.user.reponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAuthRowDto {
    private String username;
    private String password;
    private UUID id;
    private String fullName;
    private String positionName;
    private String role;
}
