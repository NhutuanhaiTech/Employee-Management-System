package com.example.qlnv.service.iplm;

import com.example.qlnv.constant.FamilyConstants;
import com.example.qlnv.dto.employee.request.EmployeeFamilyRequestDto;
import com.example.qlnv.dto.employee.response.EmployeeFamilyResponseDto;
import com.example.qlnv.repository.FamilyRepository;
import com.example.qlnv.service.FamilyService;
import com.example.qlnv.utils.JsonUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FamilyServiceIplm implements FamilyService {
    private final FamilyRepository familyRepos;

    @Autowired
    public FamilyServiceIplm(FamilyRepository familyRepos) {
        this.familyRepos = familyRepos;
    }

    @Override
    @Transactional
    public void insertFamily(List<EmployeeFamilyRequestDto> dtos, UUID employeeId) {
        this.familyRepos.insertFamilyRelationships(employeeId,
                JsonUtils.toJsonString(dtos),
                FamilyConstants.MAX_FAMILY_MEMBERS
        );
    }

    @Override
    @Transactional
    public void deleteFamily(UUID employeeId) {
        this.familyRepos.deleteFamilyRelationships(employeeId);
    }

    @Override
    public List<EmployeeFamilyResponseDto> getFamilyRelationshipsByEmployeeId(UUID employeeId) {
        return this.familyRepos.getFamilyRelationshipsByEmployeeId(employeeId);
    }
}
