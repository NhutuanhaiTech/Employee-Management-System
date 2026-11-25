package com.example.qlnv.dto.approvalRequest.request;

import com.example.qlnv.constant.ApprovalContants;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ApprovalDecisionRequestDto {

    @NotNull(message = ApprovalContants.MSG_APPOINTMENT_DATE_NOT_NULL)
    @FutureOrPresent(message = ApprovalContants.MSG_APPOINTMENT_DATE_FUTURE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate appointmentDate;

    @NotNull(message = ApprovalContants.MSG_IS_QUALIFIED_NOT_NULL)
    private Boolean isQualified;

}