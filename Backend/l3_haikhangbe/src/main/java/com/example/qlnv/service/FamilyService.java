package com.example.qlnv.service;

import com.example.qlnv.dto.employee.request.EmployeeFamilyRequestDto;
import com.example.qlnv.dto.employee.response.EmployeeFamilyResponseDto;

import java.util.List;
import java.util.UUID;

public interface FamilyService {
    void insertFamily(List<EmployeeFamilyRequestDto> dtos, UUID employeeId);
    void deleteFamily(UUID employeeId);
    List<EmployeeFamilyResponseDto> getFamilyRelationshipsByEmployeeId(UUID employeeId);
}
