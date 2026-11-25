package com.example.qlnv.service;

import com.example.qlnv.dto.employee.request.EmployeeCertificateRequestDto;
import com.example.qlnv.dto.employee.response.EmployeeCertificateResponseDto;

import java.util.List;
import java.util.UUID;

public interface CertificateService {
    void insertCertificates(List<EmployeeCertificateRequestDto> dto, UUID employeeId);
    void deleteCertificates(UUID employeeId);
    List<EmployeeCertificateResponseDto> getCertificatesByEmployeeId(UUID employeeId);
}
