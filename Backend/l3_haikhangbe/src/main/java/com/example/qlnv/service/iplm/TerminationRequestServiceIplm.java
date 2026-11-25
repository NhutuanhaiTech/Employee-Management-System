package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.TerminationRequest.request.*;
import com.example.qlnv.dto.TerminationRequest.response.TerminationRequestLeaderResponseDto;
import com.example.qlnv.enums.EmployeeStatus;
import com.example.qlnv.enums.RequestStatus;
import com.example.qlnv.enums.Status;
import com.example.qlnv.repository.TerminationRequestRepository;
import com.example.qlnv.service.TerminationRequestService;
import com.example.qlnv.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TerminationRequestServiceIplm implements TerminationRequestService {

    private final TerminationRequestRepository terminationRequestRepository;

    @Transactional
    @Override
    public UUID createTerminationRequest(TerminationInitRequestDto request) {
        UUID submitterId = SecurityUtils.getCurrentUserIdAsUUID();
        String submitterUsername = SecurityUtils.getCurrentUsername();

        String[] activeStatuses = {
                RequestStatus.PENDING.name(),
                RequestStatus.UPDATE_REQUIRED.name(),
                RequestStatus.DRAFT.name()
        };

        return terminationRequestRepository.callInsertTerminationRequest(
                request.getEmployeeId(),
                submitterId,
                submitterUsername,
                RequestStatus.DRAFT.name(),
                activeStatuses,
                EmployeeStatus.TERMINATION_DRAFT.name()
        );
    }

    @Transactional
    @Override
    public void submitTerminationRequest(TerminationSubmitRequestDto request) {
        UUID submitterId = SecurityUtils.getCurrentUserIdAsUUID();

        String[] allowedStatuses = {
                RequestStatus.DRAFT.name(),
                RequestStatus.UPDATE_REQUIRED.name()
        };

        terminationRequestRepository.callSubmitTerminationRequest(
                request.getFormId(),
                submitterId,
                request.getLeaderId(),
                request.getSubmitNote(),
                request.getSubmitDate(),
                RequestStatus.PENDING.name(),
                allowedStatuses,
                EmployeeStatus.TERMINATION_PENDING.name()
        );
    }

    @Override
    public List<TerminationRequestLeaderResponseDto> getRequestsForLeader(
            SearchStatusDto dto
    ) {
        UUID leaderId = SecurityUtils.getCurrentUserIdAsUUID();

        int limit = dto.getSize();
        int offset = (dto.getPage() - 1) * limit;

        return  terminationRequestRepository
                .getRequestsByStatusForLeader(
                        leaderId,
                        dto.getStatus(),
                        limit,
                        offset
                );
    }

    @Transactional
    @Override
    public void approveTerminationRequest(UUID requestId, TerminationApproveRequestDto request) {
        UUID leaderId = SecurityUtils.getCurrentUserIdAsUUID();

        String[] allowedStatuses = { Status.PENDING.name() };

        terminationRequestRepository.callApproveTerminationRequest(
                requestId,
                leaderId,
                request.getDecisionDate(),
                RequestStatus.APPROVED.name(),
                allowedStatuses,
                EmployeeStatus.TERMINATED.name()
        );
    }

    @Transactional
    @Override
    public void rejectTerminationRequest(UUID requestId, TerminationRejectRequestDto request) {
        UUID leaderId = SecurityUtils.getCurrentUserIdAsUUID();
        String[] allowedStatuses = { Status.PENDING.name() };

        terminationRequestRepository.callRejectTerminationRequest(
                requestId,
                leaderId,
                request.getLeaderFeedback(),
                request.getDecisionDate(),
                RequestStatus.REJECTED.name(),
                allowedStatuses,
                EmployeeStatus.APPROVED.name()
        );
    }

    @Transactional
    @Override
    public void requireUpdateTerminationRequest(UUID requestId, TerminationRequireUpdateRequestDto request) {
        UUID leaderId = SecurityUtils.getCurrentUserIdAsUUID();
        String[] allowedStatuses = { Status.PENDING.name() };

        terminationRequestRepository.callRequireUpdateTerminationRequest(
                requestId,
                leaderId,
                request.getLeaderFeedback(),
                request.getDecisionDate(),
                RequestStatus.UPDATE_REQUIRED.name(),
                allowedStatuses,
                EmployeeStatus.TERMINATION_UPDATE_REQUIRED.name()
        );
    }

    @Transactional
    @Override
    public void resubmitTerminationRequest(TerminationResubmitRequestDto request) {
        UUID submitterId = SecurityUtils.getCurrentUserIdAsUUID();

        String[] allowedStatuses = { Status.UPDATE_REQUIRED.name() };

        terminationRequestRepository.callResubmitTerminationRequest(
                request.getFormId(),
                submitterId,
                request.getSubmitNote(),
                request.getSubmitDate(),
                Status.PENDING.name(),
                EmployeeStatus.TERMINATION_PENDING.name(),
                allowedStatuses
        );
    }
}