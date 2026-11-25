package com.example.qlnv.dto.SalaryIncreaseRequest.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryIncreaseResponseDto {
    private LocalDate increaseDate;
    private Integer increaseTimes;
    private String newSalaryLevel;
    private String reason;
    private String note;
}