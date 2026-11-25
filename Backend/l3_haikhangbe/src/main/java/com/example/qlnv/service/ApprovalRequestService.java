package com.example.qlnv.service;

import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.approvalRequest.request.ApprovalDecisionRequestDto;
import com.example.qlnv.dto.approvalRequest.request.ApprovalFeedbackRequestDto;
import com.example.qlnv.dto.approvalRequest.request.ApprovalInsertUpdateRequestDto;
import com.example.qlnv.dto.approvalRequest.response.ApprovalResponseDto;

import java.util.List;
import java.util.UUID;

public interface ApprovalRequestService {
    UUID createApprovalRequest(ApprovalInsertUpdateRequestDto request);
    List<ApprovalResponseDto> getApprovalRequestsPaginated(SearchStatusDto dto);
    void approveRequest(UUID requestId, ApprovalDecisionRequestDto dto);
    void updateApprovalRequest(ApprovalInsertUpdateRequestDto request);
    void requireUpdate(UUID requestId, ApprovalFeedbackRequestDto dto);
    void rejectRequest(UUID requestId, ApprovalFeedbackRequestDto dto);
}
