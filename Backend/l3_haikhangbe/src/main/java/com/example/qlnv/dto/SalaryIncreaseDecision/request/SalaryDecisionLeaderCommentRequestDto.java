package com.example.qlnv.dto.SalaryIncreaseDecision.request;

import com.example.qlnv.constant.SalaryIncreaseDecisionConstants;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SalaryDecisionLeaderCommentRequestDto {
    @NotBlank(message = SalaryIncreaseDecisionConstants.LEADER_COMMENT_NOT_BLANK)
    private String leaderComment;
}
