package com.example.qlnv.dto.TerminationForm.request;

import com.example.qlnv.constant.TerminationFormConstants;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TerminationFormUpdateRequestDto {

    @NotNull(message = TerminationFormConstants.VAL_END_DATE_NOT_NULL)
    @FutureOrPresent(message = TerminationFormConstants.VAL_END_DATE_FUTURE)
    private LocalDate endDate;

    @NotBlank(message = TerminationFormConstants.VAL_REASON_NOT_BLANK)
    @Size(max = 2000, message = TerminationFormConstants.VAL_REASON_SIZE)
    private String reason;

    @NotBlank(message = TerminationFormConstants.VAL_DEPT_NOT_BLANK)
    @Size(max = 255, message = TerminationFormConstants.VAL_DEPT_SIZE)
    private String toDepartment;

    @NotBlank(message = TerminationFormConstants.VAL_SUBJECT_NOT_BLANK)
    @Size(max = 255, message = TerminationFormConstants.VAL_SUBJECT_SIZE)
    private String subject;

    @NotBlank(message = TerminationFormConstants.VAL_HANDOVER_NOT_BLANK)
    @Size(max = 5000, message = TerminationFormConstants.VAL_HANDOVER_SIZE)
    private String handoverContent;
}