package com.example.qlnv.dto.employee.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeFamilyResponseDto {
    private UUID id;
    private String fullName;
    private String relationshipType;
    private String gender;
    private LocalDate dob;
    private String idNumber;
    private String address;
    private String phone;
}