package com.example.qlnv.dto.TerminationRequest.request;

import com.example.qlnv.constant.TerminationRequestConstants;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TerminationApproveRequestDto {

    @NotNull(message = TerminationRequestConstants.VAL_DECISION_DATE_NOT_NULL)
    @FutureOrPresent(message = TerminationRequestConstants.VAL_DECISION_DATE_FUTURE)
        private LocalDate decisionDate;

}