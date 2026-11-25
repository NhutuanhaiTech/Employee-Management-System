package com.example.qlnv.repository;

import com.example.qlnv.dto.TerminationRequest.response.TerminationRequestLeaderResponseDto;
import com.example.qlnv.entity.TerminationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TerminationRequestRepository extends JpaRepository<TerminationRequest, UUID> {

    @Query(value = "SELECT func_insert_termination_request(" +
            ":employeeId, " +
            ":submitterId, " +
            ":submitterUsername, " +
            ":status, " +
            "CAST(:activeStatuses AS VARCHAR[]), " +
            ":employeeStatus)",
            nativeQuery = true)
    UUID callInsertTerminationRequest(
            @Param("employeeId") UUID employeeId,
            @Param("submitterId") UUID submitterId,
            @Param("submitterUsername") String submitterUsername,
            @Param("status") String status,
            @Param("activeStatuses") String[] activeStatuses,
            @Param("employeeStatus") String employeeStatus
    );

    @Modifying
    @Query(value = "CALL sp_submit_termination_request(" +
            ":formId, " +
            ":submitterId, " +
            ":leaderId, " +
            ":submitNote, " +
            ":submitDate, " +
            ":targetStatus, " +
            "CAST(:allowedStatuses AS VARCHAR[]), " +
            ":targetEmployeeStatus)",
            nativeQuery = true)
    void callSubmitTerminationRequest(
            @Param("formId") UUID formId,
            @Param("submitterId") UUID submitterId,
            @Param("leaderId") UUID leaderId,
            @Param("submitNote") String submitNote,
            @Param("submitDate") LocalDate submitDate,
            @Param("targetStatus") String targetStatus,
            @Param("allowedStatuses") String[] allowedStatuses,
            @Param("targetEmployeeStatus") String targetEmployeeStatus
    );

    @Query(value = "SELECT * FROM func_get_requests_by_status_for_leader(" +
            ":leaderId, " +
            ":status, " +
            ":limit, " +
            ":offset)",
            nativeQuery = true)
    List<TerminationRequestLeaderResponseDto> getRequestsByStatusForLeader(
            @Param("leaderId") UUID leaderId,
            @Param("status") String status,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );

    @Modifying
    @Query(value = "CALL sp_approve_termination_request(" +
            ":requestId, " +
            ":leaderId, " +
            ":decisionDate, " +
            ":targetStatus, " +
            "CAST(:allowedStatuses AS VARCHAR[]), " +
            ":terminatedEmployeeStatus)",
            nativeQuery = true)
    void callApproveTerminationRequest(
            @Param("requestId") UUID requestId,
            @Param("leaderId") UUID leaderId,
            @Param("decisionDate") LocalDate decisionDate,
            @Param("targetStatus") String targetStatus,
            @Param("allowedStatuses") String[] allowedStatuses,
            @Param("terminatedEmployeeStatus") String terminatedEmployeeStatus
    );

    @Modifying
    @Query(value = "CALL sp_reject_termination_request(" +
            ":requestId, " +
            ":leaderId, " +
            ":leaderFeedback, " +
            ":decisionDate, " +
            ":targetStatus, " +
            "CAST(:allowedStatuses AS VARCHAR[]), " +
            ":approvedEmployeeStatus)",
            nativeQuery = true)
    void callRejectTerminationRequest(
            @Param("requestId") UUID requestId,
            @Param("leaderId") UUID leaderId,
            @Param("leaderFeedback") String leaderFeedback,
            @Param("decisionDate") LocalDate decisionDate,
            @Param("targetStatus") String targetStatus,
            @Param("allowedStatuses") String[] allowedStatuses,
            @Param("approvedEmployeeStatus") String approvedEmployeeStatus
    );

    @Modifying
    @Query(value = "CALL sp_require_update_termination_request(" +
            ":requestId, " +
            ":leaderId, " +
            ":leaderFeedback, " +
            ":decisionDate, " +
            ":targetStatus, " +
            "CAST(:allowedStatuses AS VARCHAR[]), " +
            ":updateRequiredEmployeeStatus)",
            nativeQuery = true)
    void callRequireUpdateTerminationRequest(
            @Param("requestId") UUID requestId,
            @Param("leaderId") UUID leaderId,
            @Param("leaderFeedback") String leaderFeedback,
            @Param("decisionDate") LocalDate decisionDate,
            @Param("targetStatus") String targetStatus,
            @Param("allowedStatuses") String[] allowedStatuses,
            @Param("updateRequiredEmployeeStatus") String updateRequiredEmployeeStatus
    );

    @Modifying
    @Query(value = "CALL sp_resubmit_termination_request(" +
            ":formId, " +
            ":submitterId, " +
            ":submitNote, " +
            ":submitDate, " +
            ":targetRequestStatus, " +
            ":targetEmployeeStatus, " +
            "CAST(:allowedStatuses AS VARCHAR[]))",
            nativeQuery = true)
    void callResubmitTerminationRequest(
            @Param("formId") UUID formId,
            @Param("submitterId") UUID submitterId,
            @Param("submitNote") String submitNote,
            @Param("submitDate") LocalDate submitDate,
            @Param("targetRequestStatus") String targetRequestStatus,
            @Param("targetEmployeeStatus") String targetEmployeeStatus,
            @Param("allowedStatuses") String[] allowedStatuses
    );
}