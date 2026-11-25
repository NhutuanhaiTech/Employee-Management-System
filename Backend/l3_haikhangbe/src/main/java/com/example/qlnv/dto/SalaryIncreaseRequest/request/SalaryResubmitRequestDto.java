package com.example.qlnv.dto.SalaryIncreaseRequest.request;

import com.example.qlnv.constant.SalaryRequestConstants;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryResubmitRequestDto {

    @NotNull(message = SalaryRequestConstants.SUBMIT_DATE_NOT_NULL)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate submitDate;

}