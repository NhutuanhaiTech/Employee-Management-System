package com.example.qlnv.service;

import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.TerminationRequest.request.*;
import com.example.qlnv.dto.TerminationRequest.response.TerminationRequestLeaderResponseDto;

import java.util.List;
import java.util.UUID;

public interface TerminationRequestService {
    UUID createTerminationRequest(TerminationInitRequestDto request);
    void submitTerminationRequest(TerminationSubmitRequestDto request);
    List<TerminationRequestLeaderResponseDto> getRequestsForLeader(SearchStatusDto dto);
    void approveTerminationRequest(UUID requestId, TerminationApproveRequestDto request);
    void rejectTerminationRequest(UUID requestId, TerminationRejectRequestDto request);
    void requireUpdateTerminationRequest(UUID requestId, TerminationRequireUpdateRequestDto request);
    void resubmitTerminationRequest(TerminationResubmitRequestDto request);
}

