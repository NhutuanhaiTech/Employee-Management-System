package com.example.qlnv.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tbl_termination_requests")
@Data
public class TerminationRequest {

    @Id
    private UUID id;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "submitter_id", nullable = false)
    private UUID submitterId;

    @Column(name = "submit_date")
    private LocalDate submitDate;

    @Column(name = "leader_id")
    private UUID leaderId;

    @Column(name = "submit_note", columnDefinition = "TEXT")
    private String submitNote;

    @Column(name = "leader_feedback", columnDefinition = "TEXT")
    private String leaderFeedback;

    @Column(name = "decision_date")
    private LocalDate decisionDate;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "created_at", updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}