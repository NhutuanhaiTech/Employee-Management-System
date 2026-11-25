package com.example.qlnv.dto.SalaryIncreaseRequest.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryIncreaseHistoryResponseDto {

    private UUID id;

    private Integer increaseTimes;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate increaseDate;

    private String newSalaryLevel;

    private String reason;

    private String note;

    private String status;
}