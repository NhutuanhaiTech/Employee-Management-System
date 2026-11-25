package com.example.qlnv.dto.TerminationRequest.request;

import com.example.qlnv.constant.TerminationRequestConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class TerminationInitRequestDto {

    @NotNull(message = TerminationRequestConstants.VAL_EMPLOYEE_ID_NOT_NULL)
    private UUID employeeId;

    @NotNull(message = TerminationRequestConstants.VAL_END_DATE_NOT_NULL)
    private LocalDate endDate;

    @NotBlank(message = TerminationRequestConstants.VAL_REASON_NOT_BLANK)
    private String reason;
}