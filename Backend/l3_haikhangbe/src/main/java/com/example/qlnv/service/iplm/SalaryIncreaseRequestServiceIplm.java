package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.BasePageRequestDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.request.*;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryIncreaseHistoryResponseDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryIncreaseResponseDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryRequestForLeaderResponseDto;
import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.enums.Status;
import com.example.qlnv.repository.SalaryIncreaseRequestRepository;
import com.example.qlnv.service.SalaryIncreaseRequestService;
import com.example.qlnv.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SalaryIncreaseRequestServiceIplm implements SalaryIncreaseRequestService {

    private final SalaryIncreaseRequestRepository salaryIncreaseRequestRepository;

    @Transactional
    @Override
    public UUID createSalaryIncreaseRequest(SalaryIncreaseInsertRequestDto request) {
        UUID submitterId = SecurityUtils.getCurrentUserIdAsUUID();
        String currentUsername = SecurityUtils.getCurrentUsername();

        return this.salaryIncreaseRequestRepository.createSalaryIncreaseRequest(
                request.getEmployeeId(),
                submitterId,
                currentUsername,
                request.getIncreaseTimes(),
                request.getIncreaseDate(),
                request.getNewSalaryLevel(),
                request.getReason(),
                request.getNote(),
                Status.DRAFT.name(),
                Status.APPROVED.name()
        );
    }

    @Override
    public List<SalaryIncreaseHistoryResponseDto> getSalaryIncreaseHistory(UUID employeeId, BasePageRequestDto pageRequest) {
        int limit = pageRequest.getSize();
        int offset = (pageRequest.getPage() - 1) * limit;

        String currentUsername = SecurityUtils.getCurrentUsername();

        return salaryIncreaseRequestRepository.getSalaryIncreaseHistory(
                employeeId,
                currentUsername,
                Status.PENDING.name(),
                limit,
                offset
        );
    }

    @Override
    public SalaryIncreaseResponseDto getSalaryIncreaseRequestById(UUID id) {
        String userName = SecurityUtils.getCurrentUsername();
        return salaryIncreaseRequestRepository.getSalaryIncreaseRequestById(id, userName);
    }

    @Transactional
    @Override
    public UUID updateSalaryIncreaseRequest(UUID id, SalaryIncreaseUpdateRequestDto request) {
        String[] allowedStatuses = new String[] {
                Status.DRAFT.name(),
                Status.UPDATE_REQUIRED.name()
        };
        String submitName = SecurityUtils.getCurrentUsername();
        return salaryIncreaseRequestRepository.updateSalaryIncreaseRequest(
                id,
                submitName,
                request.getIncreaseTimes(),
                request.getIncreaseDate(),
                request.getNewSalaryLevel(),
                request.getReason(),
                request.getNote(),
                allowedStatuses,
                Status.APPROVED.name()
        );
    }

    @Transactional
    @Override
    public void deleteSalaryIncreaseRequest(UUID id) {
        String[] allowedStatuses = new String[] {
                Status.DRAFT.name()
        };
        String userName = SecurityUtils.getCurrentUsername();
        salaryIncreaseRequestRepository.deleteSalaryIncreaseRequest(
                id,
                userName,
                allowedStatuses
        );
    }
    @Transactional
    @Override
    public void submitDraftSalaryIncreaseRequest(UUID id, SalarySubmitDraftRequestDto request) {
        String currentUsername = SecurityUtils.getCurrentUsername();

        salaryIncreaseRequestRepository.callSubmitDraftSalaryIncreaseRequest(
                id,
                currentUsername,
                request.getLeaderId(),
                request.getSubmitDate(),
                Status.PENDING.name(),
                Status.DRAFT.name()
        );
    }

    @Transactional
    @Override
    public void resubmitUpdateRequiredSalaryRequest(UUID id, SalaryResubmitRequestDto request) {
        String currentUsername = SecurityUtils.getCurrentUsername();

        salaryIncreaseRequestRepository.callResubmitUpdateRequiredSalaryRequest(
                id,
                currentUsername,
                request.getSubmitDate(),
                Status.PENDING.name(),
                Status.UPDATE_REQUIRED.name()
        );
    }

    @Override
    public List<SalaryRequestForLeaderResponseDto> getSalaryIncreaseRequestsForLeader(SearchStatusDto dto) {

        UUID currentLeaderId = SecurityUtils.getCurrentUserIdAsUUID();

        int limit = dto.getSize();
        int offset = (dto.getPage() - 1) * limit;

        return salaryIncreaseRequestRepository
                .getSalaryIncreaseRequestsForLeader(currentLeaderId, dto.getStatus(), limit, offset);

    }

    @Transactional
    @Override
    public void respondSalaryIncreaseRequest(UUID id, LeaderRespondSalaryRequestDto request) {
        UUID currentLeaderId = SecurityUtils.getCurrentUserIdAsUUID();

        String[] requireStatuses = new String[] {
                Status.PENDING.name()
        };

        salaryIncreaseRequestRepository.respondSalaryIncreaseRequest(
                id,
                currentLeaderId,
                request.getFeedback(),
                request.getFeedbackDate(),
                request.getTargetStatus().name(),
                requireStatuses
        );
    }
}