package com.example.qlnv.dto.employee.request;

import com.example.qlnv.constant.EmployeeConstants;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCertificateRequestDto {

    @NotBlank(message = EmployeeConstants.VAL_CERT_NAME_NOT_BLANK)
    @Size(min = EmployeeConstants.MIN_LENGTH_CERT_NAME, max = EmployeeConstants.MAX_LENGTH_CERT_NAME, message = EmployeeConstants.VAL_CERT_NAME_SIZE)
    private String name;

    @NotNull(message = EmployeeConstants.VAL_CERT_START_DATE_NOT_NULL)
    @PastOrPresent(message = EmployeeConstants.VAL_CERT_START_DATE_PAST_PRESENT)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @NotBlank(message = EmployeeConstants.VAL_CERT_CONTENT_NOT_BLANK)
    @Size(max = EmployeeConstants.MAX_LENGTH_CERT_CONTENT, message = EmployeeConstants.VAL_CERT_CONTENT_SIZE)
    private String content;

    @NotBlank(message = EmployeeConstants.VAL_CERT_FIELD_NOT_BLANK)
    @Size(max = EmployeeConstants.MAX_LENGTH_CERT_FIELD, message = EmployeeConstants.VAL_CERT_FIELD_SIZE)
    private String field;
}