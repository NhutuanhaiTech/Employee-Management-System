package com.example.qlnv.dto.TerminationForm.request;

import com.example.qlnv.constant.TerminationFormConstants;
import com.example.qlnv.constant.TerminationRequestConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TerminationLeaderCommentRequestDto {

    @NotBlank(message = TerminationFormConstants.VAL_LEADER_COMMENT_NOT_BLANK)
    @Size(max = 1000, message = TerminationRequestConstants.VAL_FEEDBACK_SIZE)
    private String leaderComment;

}