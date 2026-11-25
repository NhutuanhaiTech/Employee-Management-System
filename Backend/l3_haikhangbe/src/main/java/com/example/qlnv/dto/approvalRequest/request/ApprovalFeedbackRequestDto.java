package com.example.qlnv.dto.approvalRequest.request;

import com.example.qlnv.constant.ApprovalContants;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalFeedbackRequestDto {

    @NotBlank(message = ApprovalContants.MSG_FEEDBACK_NOT_BLANK)
    private String feedBack;

}