package com.example.qlnv.dto.template.request;

import com.example.qlnv.constant.TemplateConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemplateLeaderCommentRequestDto {

    @NotBlank(message = TemplateConstants.MSG_COMMENT_NOT_BLANK)
    @Size(max = TemplateConstants.MAX_LENGTH_COMMENT, message = TemplateConstants.MSG_COMMENT_SIZE)
    private String comment;

}