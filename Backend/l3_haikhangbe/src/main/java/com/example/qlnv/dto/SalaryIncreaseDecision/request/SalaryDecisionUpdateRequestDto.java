package com.example.qlnv.dto.SalaryIncreaseDecision.request;

import com.example.qlnv.constant.SalaryIncreaseDecisionConstants;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryDecisionUpdateRequestDto {

    @NotBlank(message = SalaryIncreaseDecisionConstants.VAL_DECISION_NUMBER_BLANK)
    private String decisionNumber;

    @NotNull(message = SalaryIncreaseDecisionConstants.VAL_EFFECTIVE_DATE_BLANK)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate effectiveDate;

    @NotBlank(message = SalaryIncreaseDecisionConstants.VAL_CONTENT_BLANK)
    private String content;
}