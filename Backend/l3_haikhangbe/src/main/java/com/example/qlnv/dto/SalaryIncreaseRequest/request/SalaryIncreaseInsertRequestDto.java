package com.example.qlnv.dto.SalaryIncreaseRequest.request;

import com.example.qlnv.constant.SalaryRequestConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryIncreaseInsertRequestDto {

    @NotNull(message = SalaryRequestConstants.EMPLOYEE_ID_REQUIRED)
    private UUID employeeId;

    @NotNull(message = SalaryRequestConstants.INCREASE_TIMES_REQUIRED)
    @Min(value = 1, message = SalaryRequestConstants.INCREASE_TIMES_MIN)
    private Integer increaseTimes;

    @NotNull(message = SalaryRequestConstants.INCREASE_DATE_REQUIRED)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate increaseDate;

    @NotBlank(message = SalaryRequestConstants.NEW_SALARY_LEVEL_REQUIRED)
    private String newSalaryLevel;

    @NotBlank(message = SalaryRequestConstants.REASON_REQUIRED)
    private String reason;

    private String note;
}