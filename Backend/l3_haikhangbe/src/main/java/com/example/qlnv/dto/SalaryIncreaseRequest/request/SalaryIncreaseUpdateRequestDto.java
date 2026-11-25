package com.example.qlnv.dto.SalaryIncreaseRequest.request;

import com.example.qlnv.constant.SalaryRequestConstants;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryIncreaseUpdateRequestDto {

    @NotNull(message = SalaryRequestConstants.INCREASE_TIMES_REQUIRED)
    @Min(value = 1, message = SalaryRequestConstants.INCREASE_TIMES_MIN)
    private Integer increaseTimes;

    @NotNull(message = SalaryRequestConstants.INCREASE_DATE_REQUIRED)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate increaseDate;

    @NotBlank(message = SalaryRequestConstants.NEW_SALARY_LEVEL_REQUIRED)
    @Size(max = 100, message = SalaryRequestConstants.NEW_SALARY_LEVEL_MAX_LENGTH)
    private String newSalaryLevel;

    @NotBlank(message = SalaryRequestConstants.REASON_REQUIRED)
    private String reason;

    private String note;
}