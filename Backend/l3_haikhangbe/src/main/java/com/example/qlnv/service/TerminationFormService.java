package com.example.qlnv.service;

import com.example.qlnv.dto.TerminationForm.request.TerminationFormUpdateRequestDto;
import com.example.qlnv.dto.TerminationForm.request.TerminationLeaderCommentRequestDto;
import com.example.qlnv.dto.TerminationForm.response.TerminationFormResponseDto;

import java.time.LocalDate;
import java.util.UUID;

public interface TerminationFormService {
    UUID createTerminationForm(UUID requestId, LocalDate endDate, String reason);
    TerminationFormResponseDto getTerminationFormsByEmployeeId(UUID employeeId);
    void updateTerminationForm(UUID formId, TerminationFormUpdateRequestDto request);
    void updateLeaderComment(UUID requestId, TerminationLeaderCommentRequestDto request);
}
