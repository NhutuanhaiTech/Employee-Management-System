package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.TerminationForm.request.TerminationFormUpdateRequestDto;
import com.example.qlnv.dto.TerminationForm.request.TerminationLeaderCommentRequestDto;
import com.example.qlnv.dto.TerminationForm.response.TerminationFormResponseDto;
import com.example.qlnv.enums.Status;
import com.example.qlnv.repository.TerminationFormRepository;
import com.example.qlnv.service.TerminationFormService;
import com.example.qlnv.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TerminationFormServiceIplm implements TerminationFormService {

    private final TerminationFormRepository terminationFormRepository;

    @Transactional
    @Override
    public UUID createTerminationForm(UUID requestId, LocalDate endDate, String reason) {
        String submitterUsername = SecurityUtils.getCurrentUsername();

        String allowedStatus = Status.DRAFT.name();

        return terminationFormRepository.callInsertTerminationForm(
                requestId,
                submitterUsername,
                endDate,
                reason,
                allowedStatus
        );
    }

    @Override
    public TerminationFormResponseDto getTerminationFormsByEmployeeId(UUID employeeId) {
        String[] allowedStatuses = {
                Status.DRAFT.name(),
                Status.PENDING.name(),
                Status.UPDATE_REQUIRED.name()
        };

        return terminationFormRepository.getTerminationForm(employeeId, allowedStatuses);
    }

    @Transactional
    @Override
    public void updateTerminationForm(UUID formId, TerminationFormUpdateRequestDto request) {
        String currentUsername = SecurityUtils.getCurrentUsername();

        String[] allowedStatuses = {
                Status.DRAFT.name(),
                Status.UPDATE_REQUIRED.name()
        };

        terminationFormRepository.callUpdateTerminationForm(
                formId,
                currentUsername,
                request.getEndDate(),
                request.getReason(),
                request.getToDepartment(),
                request.getSubject(),
                request.getHandoverContent(),
                allowedStatuses
        );
    }

    @Transactional
    @Override
    public void updateLeaderComment(UUID requestId, TerminationLeaderCommentRequestDto request) {
        UUID leaderId = SecurityUtils.getCurrentUserIdAsUUID();

        String[] allowedStatuses = { Status.PENDING.name() };

        terminationFormRepository.callUpdateLeaderCommentInForm(
                requestId,
                leaderId,
                request.getLeaderComment(),
                allowedStatuses
        );
    }
}