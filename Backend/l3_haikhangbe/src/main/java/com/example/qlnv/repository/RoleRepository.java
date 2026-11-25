package com.example.qlnv.repository;

import com.example.qlnv.dto.role.response.RoleResponseDto;
import com.example.qlnv.entity.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.UUID;

public interface RoleRepository extends Repository<Role, UUID> {
    @Query(value = "SELECT * FROM get_all_roles()", nativeQuery = true)
    List<RoleResponseDto> findAllRolesFromFunc();
}