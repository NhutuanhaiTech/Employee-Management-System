package com.example.qlnv.repository;

import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryIncreaseHistoryResponseDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryIncreaseResponseDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryRequestForLeaderResponseDto;
import com.example.qlnv.entity.SalaryIncreaseRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Repository
public interface SalaryIncreaseRequestRepository extends Repository<SalaryIncreaseRequest, UUID> {
    @Query(value = "SELECT sp_insert_salary_increase_request(" +
            ":employeeId, " +
            ":submitterId, " +
            ":submitterUsername, " +
            ":increaseTimes, " +
            ":increaseDate, " +
            ":newSalaryLevel, " +
            ":reason, " +
            ":note, " +
            ":status, " +
            ":approvedStatus)",
            nativeQuery = true)
    UUID createSalaryIncreaseRequest(
            @Param("employeeId") UUID employeeId,
            @Param("submitterId") UUID submitterId,
            @Param("submitterUsername") String submitterUsername,
            @Param("increaseTimes") Integer increaseTimes,
            @Param("increaseDate") LocalDate increaseDate,
            @Param("newSalaryLevel") String newSalaryLevel,
            @Param("reason") String reason,
            @Param("note") String note,
            @Param("status") String status,
            @Param("approvedStatus") String approvedStatus
    );

    @Query(value = "SELECT * FROM func_get_salary_increase_history(" +
            ":employeeId, " +
            ":submitterUsername, " +
            ":priorityStatus, " +
            ":limit, " +
            ":offset)", nativeQuery = true)
    List<SalaryIncreaseHistoryResponseDto> getSalaryIncreaseHistory(
            @Param("employeeId") UUID employeeId,
            @Param("submitterUsername") String submitterUsername,
            @Param("priorityStatus") String priorityStatus,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    @Query(value = "SELECT * FROM func_get_salary_increase_request_by_id(:id, :submitterUsername)", nativeQuery = true)
    SalaryIncreaseResponseDto getSalaryIncreaseRequestById(
            @Param("id") UUID id,
            @Param("submitterUsername") String submitterUsername
    );

    @Query(value = "SELECT sp_update_salary_increase_request(" +
            ":id, " +
            ":submitterUsername, " +
            ":increaseTimes, " +
            ":increaseDate, " +
            ":newSalaryLevel, " +
            ":reason, " +
            ":note, " +
            "CAST(:statusesAllowed AS varchar[]), " +
            ":approvedStatus)",
            nativeQuery = true)
    UUID updateSalaryIncreaseRequest(
            @Param("id") UUID id,
            @Param("submitterUsername") String submitterUsername,
            @Param("increaseTimes") Integer increaseTimes,
            @Param("increaseDate") LocalDate increaseDate,
            @Param("newSalaryLevel") String newSalaryLevel,
            @Param("reason") String reason,
            @Param("note") String note,
            @Param("statusesAllowed") String[] statusesAllowed,
            @Param("approvedStatus") String approvedStatus
    );

    @Modifying
    @Query(value = "CALL sp_delete_salary_increase_request(:id, :submitterUsername, CAST(:allowedStatuses AS varchar[]))", nativeQuery = true)
    void deleteSalaryIncreaseRequest(
            @Param("id") UUID id,
            @Param("submitterUsername") String submitterUsername,
            @Param("allowedStatuses") String[] allowedStatuses
    );

    @Modifying
    @Query(value = "CALL sp_submit_draft_salary_increase_request(" +
            ":id, :submitterUsername, :leaderId, :submitDate, :targetStatus, :draftStatus)",
            nativeQuery = true)
    void callSubmitDraftSalaryIncreaseRequest(
            @Param("id") UUID id,
            @Param("submitterUsername") String submitterUsername,
            @Param("leaderId") UUID leaderId,
            @Param("submitDate") LocalDate submitDate,
            @Param("targetStatus") String targetStatus,
            @Param("draftStatus") String draftStatus
    );

    @Modifying
    @Query(value = "CALL sp_resubmit_update_required_salary_request(" +
            ":id, :submitterUsername, :submitDate, :targetStatus, :updateReqStatus)",
            nativeQuery = true)
    void callResubmitUpdateRequiredSalaryRequest(
            @Param("id") UUID id,
            @Param("submitterUsername") String submitterUsername,
            @Param("submitDate") LocalDate submitDate,
            @Param("targetStatus") String targetStatus,
            @Param("updateReqStatus") String updateReqStatus
    );

    @Query(value = "SELECT * FROM func_get_salary_increase_requests_for_leader(" +
            ":leaderId, " +
            ":status, " +
            ":limit, " +
            ":offset)", nativeQuery = true)
    List<SalaryRequestForLeaderResponseDto> getSalaryIncreaseRequestsForLeader(
            @Param("leaderId") UUID leaderId,
            @Param("status") String status,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    @Modifying
    @Query(value = "CALL sp_leader_respond_salary_increase_request(" +
            ":id, " +
            ":leaderId, " +
            ":feedback, " +
            ":feedbackDate, " +
            ":targetStatus, " +
            "CAST(:requireStatuses AS varchar[]))",
            nativeQuery = true)
    void respondSalaryIncreaseRequest(
            @Param("id") UUID id,
            @Param("leaderId") UUID leaderId,
            @Param("feedback") String feedback,
            @Param("feedbackDate") LocalDate feedbackDate,
            @Param("targetStatus") String targetStatus,
            @Param("requireStatuses") String[] requireStatuses
    );
}