package com.example.qlnv.repository;


import com.example.qlnv.dto.SalaryIncreaseDecision.response.SalaryDecisionResponseDto;
import com.example.qlnv.entity.SalaryIncreaseDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface SalaryDecisionRepository extends JpaRepository<SalaryIncreaseDecision, UUID> {

    @Query(value = "SELECT func_insert_salary_increase_decision(" +
            ":requestId, :submitterUsername, :decisionNumber, :effectiveDate, :content)",
            nativeQuery = true)
    UUID callInsertSalaryIncreaseDecision(
            @Param("requestId") UUID requestId,
            @Param("submitterUsername") String submitterUsername,
            @Param("decisionNumber") String decisionNumber,
            @Param("effectiveDate") LocalDate effectiveDate,
            @Param("content") String content
    );


    @Modifying
    @Query(value = "CALL sp_update_salary_increase_decision(" +
            ":requestId, :submiterUsername, :decisionNumber, :effectiveDate, :content, :statusRequired)",
            nativeQuery = true)
    void callUpdateSalaryIncreaseDecision(
            @Param("requestId") UUID requestId,
            @Param("submiterUsername") String submiterUsername,
            @Param("decisionNumber") String decisionNumber,
            @Param("effectiveDate") LocalDate effectiveDate,
            @Param("content") String content,
            @Param("statusRequired") String[] statusRequired
    );

    @Query(value = "SELECT * FROM func_get_salary_increase_decision_by_request_id(:requestId, :username)",
            nativeQuery = true)
    SalaryDecisionResponseDto callGetSalaryIncreaseDecisionByRequestId(
            @Param("requestId") UUID requestId,
            @Param("username") String username
    );

    @Modifying
    @Query(value = "CALL sp_leader_comment_salary_increase_decision(" +
            ":decisionId, :leaderId, :leaderComment)",
            nativeQuery = true)
    void callLeaderCommentSalaryIncreaseDecision(
            @Param("decisionId") UUID decisionId,
            @Param("leaderId") UUID leaderId,
            @Param("leaderComment") String leaderComment
    );
}