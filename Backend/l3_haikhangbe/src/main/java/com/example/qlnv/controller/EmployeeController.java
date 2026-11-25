package com.example.qlnv.controller;

import com.example.qlnv.constant.EmployeeConstants;
import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.ResponseDto;
import com.example.qlnv.dto.employee.response.EmployeeListResponseDto;
import com.example.qlnv.dto.employee.request.EmployeeInsertRequestDto;
import com.example.qlnv.dto.employee.response.EmployeeProfileResponseDto;
import com.example.qlnv.service.EmployeeProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeProfileService employeeRegistrationService;
    @Autowired
    public EmployeeController(EmployeeProfileService employeeRegistrationService) {
        this.employeeRegistrationService = employeeRegistrationService;
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<ResponseDto<EmployeeListResponseDto>> getAllEmployees(
         @RequestParam(value = "isWork", required = false) Boolean isWork,
         @Valid @ModelAttribute SearchStatusDto dto) {
        EmployeeListResponseDto response = this.employeeRegistrationService.getEmployeeListWithTotal(isWork,dto);
        return new ResponseEntity<>(
                new ResponseDto<>(EmployeeConstants.MES_GET_ALL_EMPLOYEES, response),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAnyRole('LEADER', 'MANAGER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<EmployeeProfileResponseDto> fetchEmployeeProfileById(@PathVariable("id") UUID employeeId) {
        EmployeeProfileResponseDto response = this.employeeRegistrationService.getEmployeeProfile(employeeId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<ResponseDto<UUID>> insertEmployeeInformation(@Valid @RequestBody EmployeeInsertRequestDto request) {
        UUID employeeId = employeeRegistrationService.registration(request);
        return new ResponseEntity<>(new ResponseDto<>(EmployeeConstants.MES_CREATE_NEW_EMPLOYEE_SUCCESS, employeeId), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<ResponseDto<Void>> updateEmployeeInformation(
            @Valid @RequestBody EmployeeInsertRequestDto request,
            @PathVariable("id") UUID employeeId ) {
        employeeRegistrationService.updateInfo(request, employeeId);
        return new ResponseEntity<>(new ResponseDto<>(EmployeeConstants.MES_UPDATE_NEW_EMPLOYEE_SUCCESS), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<ResponseDto<Void>> deleteEmployeeInformation(@PathVariable("id") UUID employeeId) {
        employeeRegistrationService.deleteInfo(employeeId);
        return new ResponseEntity<>(new ResponseDto<>(EmployeeConstants.MES_DELETE_EMPLOYEE_SUCCESS), HttpStatus.OK);
    }

}