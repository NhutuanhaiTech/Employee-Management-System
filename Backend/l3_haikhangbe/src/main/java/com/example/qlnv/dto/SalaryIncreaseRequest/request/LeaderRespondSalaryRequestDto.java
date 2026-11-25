package com.example.qlnv.dto.SalaryIncreaseRequest.request;

import com.example.qlnv.constant.SalaryRequestConstants;
import com.example.qlnv.enums.Status;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderRespondSalaryRequestDto {

    @NotNull(message = SalaryRequestConstants.TARGET_STATUS_REQUIRED)
    private Status targetStatus;

    private String feedback;

    @NotNull(message = SalaryRequestConstants.FEEDBACK_DATE_REQUIRED)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate feedbackDate;
}