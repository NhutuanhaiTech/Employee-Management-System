package com.example.qlnv.dto.SalaryIncreaseRequest.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryRequestForLeaderResponseDto {

    private UUID id;
    private String employeeName;
    private String employeeCode;
    private String teamName;
    private String submitterName;
    private String submitterPosition;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate submitDate;

    private String leaderName;
    private String leaderPosition;
    private String submitContent;
    private String status;

}