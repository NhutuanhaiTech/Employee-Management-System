package com.example.qlnv.dto.approvalRequest.request;
import com.example.qlnv.constant.ApprovalContants;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalInsertUpdateRequestDto {

    @NotNull(message = ApprovalContants.MSG_EMPLOYEE_ID_NOT_NULL)
    private UUID employeeId;

    @NotNull(message = ApprovalContants.MSG_LEADER_ID_NOT_NULL)
    private UUID leaderId;

    @NotBlank(message = ApprovalContants.MSG_SUBMIT_CONTENT_NOT_BLANK)
    @Size(min = 5, max = 1000, message = ApprovalContants.MSG_SUBMIT_CONTENT_SIZE)
    private String submitContent;

    @NotNull(message = ApprovalContants.MSG_SUBMIT_DATE_NOT_NULL)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate submitDate;
}