package com.example.qlnv.mapper;

import com.example.qlnv.dto.auth.request.SignUpRequestDto;
import com.example.qlnv.dto.auth.TokenPayloadDto;
import com.example.qlnv.dto.user.reponse.UserAuthRowDto;
import com.example.qlnv.dto.user.request.UserSignUpJsonPayload;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserMapper {
    public TokenPayloadDto toTokenPayloadDto(List<UserAuthRowDto> rows) {
        if (rows == null || rows.isEmpty()) {
            return null;
        }
        UserAuthRowDto firstRow = rows.getFirst();

        TokenPayloadDto dto = new TokenPayloadDto();
        dto.setId(firstRow.getId());
        dto.setUsername(firstRow.getUsername());
        dto.setFullName(firstRow.getFullName());
        dto.setPositionName(firstRow.getPositionName());

        for (UserAuthRowDto row : rows) {
            dto.addRole(row.getRole());
        }

        return dto;
    }
    public UserSignUpJsonPayload toUserJsonPayload(SignUpRequestDto dto, String hashPw) {
        UserSignUpJsonPayload usp = new UserSignUpJsonPayload();
        usp.setUsername(dto.getUsername());
        usp.setPassword(hashPw);
        usp.setPhone(dto.getPhone());
        usp.setFullName(dto.getFullName());
        usp.setEmail(dto.getEmail());
        usp.setPositionId(dto.getPositionId());
        usp.setListRoles(dto.getListRoles());
        return usp;
    }
}
