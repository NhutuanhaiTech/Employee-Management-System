package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.role.response.RoleResponseDto;
import com.example.qlnv.repository.RoleRepository;
import com.example.qlnv.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceIplm implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public List<RoleResponseDto> getAllRoles() {
        return roleRepository.findAllRolesFromFunc();
    }
}