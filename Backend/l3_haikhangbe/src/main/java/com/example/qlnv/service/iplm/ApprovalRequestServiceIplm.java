package com.example.qlnv.service.iplm;
import com.example.qlnv.constant.TemplateConstants;
import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.approvalRequest.request.ApprovalDecisionRequestDto;
import com.example.qlnv.dto.approvalRequest.request.ApprovalFeedbackRequestDto;
import com.example.qlnv.dto.approvalRequest.request.ApprovalInsertUpdateRequestDto;
import com.example.qlnv.dto.approvalRequest.response.ApprovalResponseDto;
import com.example.qlnv.enums.Status;
import com.example.qlnv.repository.ApprovalRequestRepository;
import com.example.qlnv.service.ApprovalRequestService;
import com.example.qlnv.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApprovalRequestServiceIplm implements ApprovalRequestService {

    private final ApprovalRequestRepository approvalRequestRepository;

    @Transactional
    @Override
    public UUID createApprovalRequest(ApprovalInsertUpdateRequestDto request) {
        return this.approvalRequestRepository.createApprovalRequest(
                request.getEmployeeId(),
                SecurityUtils.getCurrentUserIdAsUUID(),
                request.getSubmitDate(),
                request.getSubmitContent(),
                request.getLeaderId(),
                TemplateConstants.MIN_REQUIRED_TEMPLATES
        );
    }

    @Transactional(readOnly = true)
    @Override
    public List<ApprovalResponseDto> getApprovalRequestsPaginated(SearchStatusDto dto) {
        UUID requesterId = SecurityUtils.getCurrentUserIdAsUUID();
        int offset = (dto.getPage() - 1) * dto.getSize();
        return this.approvalRequestRepository.getApprovalRequestsPaginated(
                requesterId, dto.getStatus(), dto.getSize(), offset
        );
    }

    @Transactional
    @Override
    public void approveRequest(UUID requestId, ApprovalDecisionRequestDto dto) {
        UUID leaderId = SecurityUtils.getCurrentUserIdAsUUID();
        this.approvalRequestRepository.approveRequest(
                requestId,
                leaderId,
                dto.getAppointmentDate(),
                dto.getIsQualified(),
                Status.APPROVED.name(),
                Status.PENDING.name()
        );
    }
    @Transactional
    @Override
    public void updateApprovalRequest(ApprovalInsertUpdateRequestDto request) {
        UUID submitterId = SecurityUtils.getCurrentUserIdAsUUID();
        this.approvalRequestRepository.updateApprovalRequest(
                request.getEmployeeId(),
                submitterId,
                request.getSubmitDate(),
                request.getSubmitContent(),
                request.getLeaderId(),
                TemplateConstants.MIN_REQUIRED_TEMPLATES,
                Status.REJECTED.name(),
                Status.UPDATE_REQUIRED.name(),
                Status.PENDING.name()
        );
    }

    @Transactional
    @Override
    public void requireUpdate(UUID requestId, ApprovalFeedbackRequestDto dto) {
        UUID leaderId = SecurityUtils.getCurrentUserIdAsUUID();
        this.approvalRequestRepository.requireUpdateApprovalRequest(
                requestId,
                leaderId,
                dto.getFeedBack(),
                Status.PENDING.name(),
                Status.UPDATE_REQUIRED.name()
        );
    }
    @Transactional
    @Override
    public void rejectRequest(UUID requestId, ApprovalFeedbackRequestDto dto) {
        UUID leaderId = SecurityUtils.getCurrentUserIdAsUUID();
        this.approvalRequestRepository.rejectApprovalRequest(
                requestId,
                leaderId,
                dto.getFeedBack(),
                Status.REJECTED.name(),
                Status.PENDING.name()
        );
    }
}