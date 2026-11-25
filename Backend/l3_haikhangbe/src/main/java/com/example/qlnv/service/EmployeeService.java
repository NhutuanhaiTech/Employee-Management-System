package com.example.qlnv.service;
import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.employee.EmployeeListItemDto;
import com.example.qlnv.dto.employee.request.EmployeeInsertRequestDto;
import com.example.qlnv.dto.employee.response.EmployeeResponseDto;

import java.util.List;
import java.util.UUID;

public interface EmployeeService {
    UUID insertEmployee(EmployeeInsertRequestDto dto);
    void updateEmployee(EmployeeInsertRequestDto dto, UUID emloyeeId);
    void deleteEmployee(UUID employeeId);
    List<EmployeeListItemDto> getAllEmployees(Boolean isWork, SearchStatusDto dto);
    Long getTotalEmployees();
    EmployeeResponseDto getEmployeeById(UUID employeeId);
}
