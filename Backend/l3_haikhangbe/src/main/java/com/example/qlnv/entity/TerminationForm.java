package com.example.qlnv.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tbl_termination_forms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TerminationForm {

    @Id
    private UUID id;

    @Column(name = "request_id", nullable = false, unique = true)
    private UUID requestId;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "to_department", length = 255)
    private String toDepartment;

    @Column(name = "subject", length = 255)
    private String subject;

    @Column(name = "handover_content", columnDefinition = "TEXT")
    private String handoverContent;

    @Column(name = "leader_comment", columnDefinition = "TEXT")
    private String leaderComment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}