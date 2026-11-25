package com.example.qlnv.service;

import com.example.qlnv.dto.SalaryIncreaseDecision.request.SalaryDecisionInsertRequestDto;
import com.example.qlnv.dto.SalaryIncreaseDecision.request.SalaryDecisionUpdateRequestDto;
import com.example.qlnv.dto.SalaryIncreaseDecision.response.SalaryDecisionResponseDto;

import java.util.UUID;

public interface SalaryDecisionService {
    UUID createSalaryIncreaseDecision(SalaryDecisionInsertRequestDto request);
    UUID updateSalaryIncreaseDecision(UUID requestId, SalaryDecisionUpdateRequestDto request);
    SalaryDecisionResponseDto getSalaryIncreaseDecisionByRequestId(UUID requestId);
    void updateLeaderComment(UUID decisionId, String leaderComment);
}
