package com.example.qlnv.service.iplm;

import com.example.qlnv.constant.CertificateConstants;
import com.example.qlnv.dto.employee.request.EmployeeCertificateRequestDto;
import com.example.qlnv.dto.employee.response.EmployeeCertificateResponseDto;
import com.example.qlnv.repository.CertificateRepository;
import com.example.qlnv.service.CertificateService;
import com.example.qlnv.utils.JsonUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CertificateServiceIplm implements CertificateService {
    private final CertificateRepository cerRepos;
    @Autowired
    public CertificateServiceIplm(CertificateRepository cerRepos) {
        this.cerRepos = cerRepos;
    }

    @Transactional
    @Override
    public void insertCertificates(List<EmployeeCertificateRequestDto> dtos, UUID employeeId) {
        this.cerRepos.insertCertificates(
                employeeId,
                JsonUtils.toJsonString(dtos),
                CertificateConstants.MAX_TOTAL,
                CertificateConstants.MAX_FIELD
        );
    }

    @Transactional
    @Override
    public void deleteCertificates(UUID employeeId) {
        this.cerRepos.deleteCertificates(employeeId);
    }

    @Override
    public List<EmployeeCertificateResponseDto> getCertificatesByEmployeeId(UUID employeeId) {
        return this.cerRepos.getCertificatesByEmployeeId(employeeId);
    }
}

