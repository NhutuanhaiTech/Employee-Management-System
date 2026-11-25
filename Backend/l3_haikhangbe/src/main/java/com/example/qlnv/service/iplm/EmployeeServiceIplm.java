package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.employee.EmployeeListItemDto;
import com.example.qlnv.dto.employee.request.EmployeeInsertRequestDto;
import com.example.qlnv.dto.employee.response.EmployeeResponseDto;
import com.example.qlnv.repository.EmployeeRepository;
import com.example.qlnv.service.EmployeeService;
import com.example.qlnv.utils.JsonUtils;
import com.example.qlnv.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EmployeeServiceIplm implements EmployeeService {
    private final EmployeeRepository emRepos;
    @Autowired
    public EmployeeServiceIplm(EmployeeRepository emReposm) {
        this.emRepos = emReposm;
    }

    @Override
    @Transactional
    public UUID insertEmployee(EmployeeInsertRequestDto dto) {
            String userName = SecurityUtils.getCurrentUsername();
            dto.setCreateBy(userName);
            return this.emRepos.insertEmployee(JsonUtils.toJsonString(dto), "DRAFT");
    }

    @Override
    @Transactional
    public void updateEmployee(EmployeeInsertRequestDto dto, UUID emloyeeId) {
            String userName = SecurityUtils.getCurrentUsername();
            dto.setUpdateBy(userName);
            this.emRepos.updateEmployee(emloyeeId, JsonUtils.toJsonString(dto));
    }

    @Override
    @Transactional
    public void deleteEmployee(UUID employeeId) {
        String userName = SecurityUtils.getCurrentUsername();
        this.emRepos.deleteEmployeeInfo(employeeId, userName);
    }

    @Override
    public List<EmployeeListItemDto> getAllEmployees(Boolean isWork, SearchStatusDto dto) {
        int offset = (dto.getPage() - 1) * dto.getSize();

        return this.emRepos.getAllEmployeesPaged(dto.getSize(), offset, dto.getStatus(), isWork);
    }

    @Override
    public Long getTotalEmployees() {
        String username = SecurityUtils.getCurrentUsername();

        return this.emRepos.countEmployees(username);
    }
    @Override
    public EmployeeResponseDto getEmployeeById(UUID employeeId) {
        return this.emRepos.getEmployeeById(employeeId);
    }
}
