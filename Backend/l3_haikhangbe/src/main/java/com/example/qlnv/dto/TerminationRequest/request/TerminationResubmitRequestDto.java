package com.example.qlnv.dto.TerminationRequest.request;

import com.example.qlnv.constant.TerminationRequestConstants;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class TerminationResubmitRequestDto {

    @NotNull(message = TerminationRequestConstants.VAL_FORM_ID_NOT_NULL)
    private UUID formId;

    @NotNull(message = TerminationRequestConstants.VAL_SUBMIT_DATE_NOT_NULL)
    private LocalDate submitDate;

    @Size(max = 1000, message = TerminationRequestConstants.VAL_SUBMIT_NOTE_SIZE)
    private String submitNote;
}