package com.example.qlnv.repository;

import com.example.qlnv.dto.TerminationForm.response.TerminationFormResponseDto;
import com.example.qlnv.entity.TerminationForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface TerminationFormRepository extends JpaRepository<TerminationForm, UUID> {

    @Query(value = "SELECT func_insert_termination_form(" +
            ":requestId, " +
            ":submitterUsername, " +
            ":endDate, " +
            ":reason, " +
            ":allowedStatus)",
            nativeQuery = true)
    UUID callInsertTerminationForm(
            @Param("requestId") UUID requestId,
            @Param("submitterUsername") String submitterUsername,
            @Param("endDate") LocalDate endDate,
            @Param("reason") String reason,
            @Param("allowedStatus") String allowedStatus
    );
    @Query(value = "SELECT * FROM func_get_termination_form(" +
            ":employeeId, " +
            "cast(:allowedStatuses as varchar[]))",
            nativeQuery = true)
    TerminationFormResponseDto getTerminationForm(
                    @Param("employeeId") UUID employeeId,
                    @Param("allowedStatuses") String[] allowedStatuses
            );

    @Modifying
    @Query(value = "CALL sp_update_termination_form(" +
            ":formId, " +
            ":username, " +
            ":endDate, " +
            ":reason, " +
            ":toDepartment, " +
            ":subject, " +
            ":handoverContent, " +
            "cast(:allowedStatuses as varchar[]))",
            nativeQuery = true)
    void callUpdateTerminationForm(
            @Param("formId") UUID formId,
            @Param("username") String username,
            @Param("endDate") LocalDate endDate,
            @Param("reason") String reason,
            @Param("toDepartment") String toDepartment,
            @Param("subject") String subject,
            @Param("handoverContent") String handoverContent,
            @Param("allowedStatuses") String[] allowedStatuses
    );

    @Modifying
    @Query(value = "CALL sp_update_leader_comment_in_form(" +
            ":requestId, " +
            ":leaderId, " +
            ":leaderComment, " +
            "CAST(:allowedStatuses AS VARCHAR[]))",
            nativeQuery = true)
    void callUpdateLeaderCommentInForm(
            @Param("requestId") UUID requestId,
            @Param("leaderId") UUID leaderId,
            @Param("leaderComment") String leaderComment,
            @Param("allowedStatuses") String[] allowedStatuses
    );
}