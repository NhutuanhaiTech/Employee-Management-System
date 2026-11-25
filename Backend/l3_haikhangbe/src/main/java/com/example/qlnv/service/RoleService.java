package com.example.qlnv.service;

import com.example.qlnv.dto.role.response.RoleResponseDto;
import java.util.List;

public interface RoleService {
    List<RoleResponseDto> getAllRoles();
}