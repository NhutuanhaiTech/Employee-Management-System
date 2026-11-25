package com.example.qlnv.service;

import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.employee.response.EmployeeListResponseDto;
import com.example.qlnv.dto.employee.request.EmployeeInsertRequestDto;
import com.example.qlnv.dto.employee.response.EmployeeProfileResponseDto;

import java.util.UUID;

public interface EmployeeProfileService {
    UUID registration(EmployeeInsertRequestDto dto);
    void updateInfo(EmployeeInsertRequestDto dto, UUID employeeId);
    void deleteInfo(UUID employeeId);
    EmployeeListResponseDto getEmployeeListWithTotal(Boolean isWork, SearchStatusDto dto);
    EmployeeProfileResponseDto getEmployeeProfile(UUID employeeId);
}
