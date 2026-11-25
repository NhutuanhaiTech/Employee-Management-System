package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.SalaryIncreaseDecision.request.SalaryDecisionInsertRequestDto;
import com.example.qlnv.dto.SalaryIncreaseDecision.request.SalaryDecisionUpdateRequestDto;
import com.example.qlnv.dto.SalaryIncreaseDecision.response.SalaryDecisionResponseDto;
import com.example.qlnv.enums.Status;
import com.example.qlnv.repository.SalaryDecisionRepository;
import com.example.qlnv.service.SalaryDecisionService;
import com.example.qlnv.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SalaryDecisionServiceIplm implements SalaryDecisionService {

    private final SalaryDecisionRepository salaryDecisionRepository;

    @Transactional
    @Override
    public UUID createSalaryIncreaseDecision(SalaryDecisionInsertRequestDto request) {
        String currentUsername = SecurityUtils.getCurrentUsername();

        return this.salaryDecisionRepository.callInsertSalaryIncreaseDecision(
                request.getRequestId(),
                currentUsername,
                request.getDecisionNumber(),
                request.getEffectiveDate(),
                request.getContent()
        );
    }
    @Transactional
    @Override
    public UUID updateSalaryIncreaseDecision(UUID requestId, SalaryDecisionUpdateRequestDto request) {
        String currentUsername = SecurityUtils.getCurrentUsername();

        String[] allowedStatuses = new String[] {
                Status.DRAFT.name(),
                Status.UPDATE_REQUIRED.name()
        };

        this.salaryDecisionRepository.callUpdateSalaryIncreaseDecision(
                requestId,
                currentUsername,
                request.getDecisionNumber(),
                request.getEffectiveDate(),
                request.getContent(),
                allowedStatuses
        );

        return requestId;
    }

    @Override
    public SalaryDecisionResponseDto getSalaryIncreaseDecisionByRequestId(UUID requestId) {
        String currentUsername = SecurityUtils.getCurrentUsername();

        return salaryDecisionRepository.callGetSalaryIncreaseDecisionByRequestId(
                requestId,
                currentUsername
        );
    }

    @Transactional
    @Override
    public void updateLeaderComment(UUID decisionId, String leaderComment) {
        UUID leaderId = SecurityUtils.getCurrentUserIdAsUUID();
        this.salaryDecisionRepository.callLeaderCommentSalaryIncreaseDecision(
                decisionId,
                leaderId,
                leaderComment
        );
    }
}