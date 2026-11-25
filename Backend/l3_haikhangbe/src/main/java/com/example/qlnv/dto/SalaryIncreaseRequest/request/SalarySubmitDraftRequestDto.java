package com.example.qlnv.dto.SalaryIncreaseRequest.request;

import com.example.qlnv.constant.SalaryRequestConstants;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalarySubmitDraftRequestDto {

    @NotNull(message = SalaryRequestConstants.LEADER_ID_NOT_NULL)
    private UUID leaderId;

    @NotNull(message = SalaryRequestConstants.SUBMIT_DATE_NOT_NULL)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate submitDate;

}