package com.example.qlnv.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "tbl_approval_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequest {

    @Id
    private UUID id;

    @Column(name = "employee_id")
    private UUID employeeId;

    @Column(name = "submitter_id")
    private UUID submitterId;

    @Column(name = "leader_id")
    private UUID leaderId;

    @Column(name = "submit_date")
    private LocalDate submitDate;

    @Column(name = "submit_content")
    private String submitContent;

    @Column(name = "status")
    private String status;

    @Column(name = "is_qualified")
    private Boolean isQualified;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "feed_back")
    private String feedBack;

    @Column(name = "feed_back_date")
    private LocalDate feedBackDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}