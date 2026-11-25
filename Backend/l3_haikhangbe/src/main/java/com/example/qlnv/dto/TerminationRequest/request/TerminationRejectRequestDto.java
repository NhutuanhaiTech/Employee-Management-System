package com.example.qlnv.dto.TerminationRequest.request;

import com.example.qlnv.constant.TerminationRequestConstants;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TerminationRejectRequestDto {

    @FutureOrPresent(message = TerminationRequestConstants.VAL_DECISION_DATE_FUTURE)
    private LocalDate decisionDate;

    @NotBlank(message = TerminationRequestConstants.VAL_REJECT_REASON_NOT_BLANK)
    @Size(max = 1000, message = TerminationRequestConstants.VAL_FEEDBACK_SIZE)
    private String leaderFeedback;

}