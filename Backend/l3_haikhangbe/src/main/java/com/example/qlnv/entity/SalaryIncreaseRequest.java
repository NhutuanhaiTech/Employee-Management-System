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
import java.util.UUID;

@Entity
@Table(name = "tbl_salary_increase_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalaryIncreaseRequest {
    @Id
    private UUID id;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "submitter_id", nullable = false)
    private UUID submitterId;

    @Column(name = "leader_id")
    private UUID leaderId;

    @Column(name = "increase_date", nullable = false)
    private LocalDate increaseDate;

    @Column(name = "increase_times", nullable = false)
    private Integer increaseTimes;

    @Column(name = "new_salary_level", nullable = false)
    private String newSalaryLevel;

    @Column(name = "reason")
    private String reason;

    @Column(name = "note")
    private String note;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "leader_feedback")
    private String leaderFeedback;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}