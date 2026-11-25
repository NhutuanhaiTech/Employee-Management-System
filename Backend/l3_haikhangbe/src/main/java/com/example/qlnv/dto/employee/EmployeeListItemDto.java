package com.example.qlnv.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeListItemDto {
    private UUID id;
    private String employeeCode;
    private String idNumber;
    private String fullName;
    private String gender;
    private LocalDate dob;
    private String phone;
    private String email;
    private String teamName;
    private String status;
    private String createdName;
    private String positionName;
    private String usernameCreated;
}