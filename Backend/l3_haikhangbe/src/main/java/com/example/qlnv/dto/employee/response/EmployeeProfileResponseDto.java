package com.example.qlnv.dto.employee.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeProfileResponseDto {
    private EmployeeResponseDto employeeInfo;
    private List<EmployeeCertificateResponseDto> certificates;
    private List<EmployeeFamilyResponseDto> familyRelationships;
}