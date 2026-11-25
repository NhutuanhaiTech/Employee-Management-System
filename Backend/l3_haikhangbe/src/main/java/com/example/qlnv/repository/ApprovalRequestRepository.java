package com.example.qlnv.repository;

import com.example.qlnv.dto.approvalRequest.response.ApprovalResponseDto;
import com.example.qlnv.entity.ApprovalRequest;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.Repository;
@org.springframework.stereotype.Repository
public interface ApprovalRequestRepository extends Repository<ApprovalRequest, UUID> {

    @Query(value = "SELECT fn_insert_approval_request(" +
            ":employeeId, " +
            ":submitterId, " +
            ":submitDate, " +
            ":submitContent, " +
            ":leaderId, " +
            ":minTem)",
            nativeQuery = true)
    UUID createApprovalRequest(
            @Param("employeeId") UUID employeeId,
            @Param("submitterId") UUID submitterId,
            @Param("submitDate") LocalDate submitDate,
            @Param("submitContent") String submitContent,
            @Param("leaderId") UUID leaderId,
            @Param("minTem") Integer minTem
    );

    @Query(value = "SELECT * FROM get_approval_requests_paginated(:requesterId, :status, :limit, :offset)", nativeQuery = true)
    List<ApprovalResponseDto> getApprovalRequestsPaginated(
            @Param("requesterId") UUID requesterId,
            @Param("status") String status,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    @Modifying
    @Transactional
    @Query(value = "CALL sp_process_approval_request(:requestId, :leaderId, :appointmentDate, :isQualified, :status, :requiredStatus)", nativeQuery = true)
    void approveRequest(
            @Param("requestId") UUID requestId,
            @Param("leaderId") UUID leaderId,
            @Param("appointmentDate") LocalDate appointmentDate,
            @Param("isQualified") Boolean isQualified,
            @Param("status") String status,
            @Param("requiredStatus") String requiredStatus
    );

    @Modifying
    @Transactional
    @Query(value = "CALL sp_update_approval_request(" +
            ":employeeId, " +
            ":submitterId, " +
            ":submitDate, " +
            ":content, " +
            ":leaderId, " +
            ":minTemplates, " +
            ":validStatus1, " +
            ":validStatus2, " +
            ":targetStatus)",
            nativeQuery = true)
    void updateApprovalRequest(
            @Param("employeeId") UUID employeeId,
            @Param("submitterId") UUID submitterId,
            @Param("submitDate") LocalDate submitDate,
            @Param("content") String content,
            @Param("leaderId") UUID leaderId,
            @Param("minTemplates") Integer minTemplates,
            @Param("validStatus1") String validStatus1,
            @Param("validStatus2") String validStatus2,
            @Param("targetStatus") String targetStatus
    );

    @Modifying
    @Query(value = "CALL sp_require_update_approval_request(:requestId, :leaderId, :feedBack, :validStatus, :targetStatus)", nativeQuery = true)
    void requireUpdateApprovalRequest(
            @Param("requestId") UUID requestId,
            @Param("leaderId") UUID leaderId,
            @Param("feedBack") String feedBack,
            @Param("validStatus") String validStatus,
            @Param("targetStatus") String targetStatus
    );

    @Modifying
    @Transactional
    @Query(value = "CALL sp_reject_approval_request(:requestId, :leaderId, :feedBack, :status, :requiredStatus)", nativeQuery = true)
    void rejectApprovalRequest(
            @Param("requestId") UUID requestId,
            @Param("leaderId") UUID leaderId,
            @Param("feedBack") String feedBack,
            @Param("status") String status,
            @Param("requiredStatus") String requiredStatus
    );
}