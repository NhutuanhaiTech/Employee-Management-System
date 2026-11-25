package com.example.qlnv.dto.template.request;

import com.example.qlnv.constant.TemplateConstants;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Getter
@Setter
public class TemplateUpdateRequestDto {

    @NotNull(message = TemplateConstants.MSG_FORM_DATA_NOT_NULL)
    @NotEmpty(message = TemplateConstants.MSG_FORM_DATA_NOT_EMPTY)
    private Map<String, Object> formData;

}