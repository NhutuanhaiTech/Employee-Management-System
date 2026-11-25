package com.example.qlnv.dto.employee.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponseDto {
    private UUID id;
    private String employeeCode;
    private String fullName;
    private String gender;
    private LocalDate dob;
    private String idNumber;
    private UUID teamId;
    private String phone;
    private String email;
    private String address;
    private String status;
    private UUID leaderId;
    private String feedBack;
    private LocalDate feedBackDate;
    private String positionName;
}