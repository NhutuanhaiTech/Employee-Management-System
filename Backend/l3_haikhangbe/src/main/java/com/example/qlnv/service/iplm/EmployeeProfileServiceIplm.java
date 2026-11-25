package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.employee.*;
import com.example.qlnv.dto.employee.request.EmployeeInsertRequestDto;
import com.example.qlnv.dto.employee.response.*;
import com.example.qlnv.service.CertificateService;
import com.example.qlnv.service.EmployeeProfileService;
import com.example.qlnv.service.EmployeeService;
import com.example.qlnv.service.FamilyService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EmployeeProfileServiceIplm implements EmployeeProfileService {
    private final EmployeeService employeeService;
    private final CertificateService certificateService;
    private final FamilyService familyService;

    @Autowired
    public EmployeeProfileServiceIplm(
            EmployeeService employeeService,
            CertificateService certificateService,
            FamilyService familyService) {
        this.employeeService = employeeService;
        this.certificateService = certificateService;
        this.familyService = familyService;
    }

    @Override
    @Transactional
    public UUID registration(EmployeeInsertRequestDto dto) {
        UUID employeeId = this.employeeService.insertEmployee(dto);
        this.certificateService.insertCertificates(dto.getCertificates(), employeeId);
        this.familyService.insertFamily(dto.getFamilyRelationships(), employeeId);
        return employeeId;
    }

    @Override
    @Transactional
    public void updateInfo(EmployeeInsertRequestDto dto, UUID employeeId) {
        this.employeeService.updateEmployee(dto, employeeId);
        this.certificateService.insertCertificates(dto.getCertificates(), employeeId);
        this.familyService.insertFamily(dto.getFamilyRelationships(), employeeId);
    }

    @Override
    @Transactional
    public void deleteInfo(UUID employeeId) {
        this.certificateService.deleteCertificates(employeeId);
        this.familyService.deleteFamily(employeeId);
        this.employeeService.deleteEmployee(employeeId);
    }

    @Override
    public EmployeeListResponseDto getEmployeeListWithTotal(Boolean isWork, SearchStatusDto dto) {
        List<EmployeeListItemDto> employees = this.employeeService.getAllEmployees(isWork, dto);
        Long totalRecords = this.employeeService.getTotalEmployees();
        long safeTotal = (totalRecords != null) ? totalRecords : 0L;
        return new EmployeeListResponseDto(employees, safeTotal);
    }
    @Override
    public EmployeeProfileResponseDto getEmployeeProfile(UUID employeeId) {
        EmployeeResponseDto employeeInfo = this.employeeService.getEmployeeById(employeeId);
        List<EmployeeCertificateResponseDto> certificates = this.certificateService.getCertificatesByEmployeeId(employeeId);
        List<EmployeeFamilyResponseDto> familyRelationships = this.familyService.getFamilyRelationshipsByEmployeeId(employeeId);
        return new EmployeeProfileResponseDto(employeeInfo, certificates, familyRelationships);
    }
}
