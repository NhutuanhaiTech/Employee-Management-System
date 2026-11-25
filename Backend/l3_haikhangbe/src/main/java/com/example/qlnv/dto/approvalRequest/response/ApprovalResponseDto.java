package com.example.qlnv.dto.approvalRequest.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalResponseDto {
    private UUID id;
    private String employeeName;
    private String employeeCode;
    private String teamName;
    private String submitterName;
    private String submitterPosition;
    private LocalDate submitDate;
    private String leaderName;
    private String leaderPosition;
    private String submitContent;
    private String status;
    private Long totalRecords;
    private UUID employeeId;
    private UUID leaderId;
    private String feedBack;
    private LocalDate feedBackDate;
}