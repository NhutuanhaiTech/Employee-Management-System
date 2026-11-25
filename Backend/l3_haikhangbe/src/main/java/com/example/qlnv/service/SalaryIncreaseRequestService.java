package com.example.qlnv.service;


import com.example.qlnv.dto.BasePageRequestDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.request.*;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryIncreaseHistoryResponseDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryIncreaseResponseDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryRequestForLeaderResponseDto;
import com.example.qlnv.dto.SearchStatusDto;

import java.util.List;
import java.util.UUID;

public interface SalaryIncreaseRequestService {
    UUID createSalaryIncreaseRequest(SalaryIncreaseInsertRequestDto request);
    List<SalaryIncreaseHistoryResponseDto> getSalaryIncreaseHistory(
            UUID employeeId,
            BasePageRequestDto pageRequest
    );
    SalaryIncreaseResponseDto getSalaryIncreaseRequestById(UUID id);
    UUID updateSalaryIncreaseRequest(UUID id, SalaryIncreaseUpdateRequestDto request);
    void deleteSalaryIncreaseRequest(UUID id);
    void submitDraftSalaryIncreaseRequest(UUID id, SalarySubmitDraftRequestDto request);
    void resubmitUpdateRequiredSalaryRequest(UUID id, SalaryResubmitRequestDto request);
    List<SalaryRequestForLeaderResponseDto> getSalaryIncreaseRequestsForLeader(SearchStatusDto dto);
    void respondSalaryIncreaseRequest(UUID id, LeaderRespondSalaryRequestDto request);
}