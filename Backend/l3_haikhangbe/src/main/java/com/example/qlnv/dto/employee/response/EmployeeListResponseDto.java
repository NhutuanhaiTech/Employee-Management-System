package com.example.qlnv.dto.employee.response;

import com.example.qlnv.dto.employee.EmployeeListItemDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeListResponseDto {
    private List<EmployeeListItemDto> employees;
    private long totalRecords;
}