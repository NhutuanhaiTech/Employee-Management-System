package com.example.qlnv.dto.TerminationRequest.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TerminationRequestLeaderResponseDto {
    private UUID requestId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private LocalDate submitDate;
    private String leaderName;
    private String leaderPosition;
    private String submitNote;
    private String submitterName;
    private String status;
}