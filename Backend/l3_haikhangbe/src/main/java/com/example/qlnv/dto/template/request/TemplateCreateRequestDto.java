package com.example.qlnv.dto.template.request;

import com.example.qlnv.constant.TemplateConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Map;
import java.util.UUID;

@Data
public class TemplateCreateRequestDto {

    @NotNull(message = TemplateConstants.MSG_EMPLOYEE_ID_NOT_NULL)
    private UUID employeeId;

    @NotBlank(message = TemplateConstants.MSG_FORM_TYPE_NOT_BLANK)
    @Pattern(
            regexp = TemplateConstants.FORM_TYPE_REGEX,
            message = TemplateConstants.MSG_FORM_TYPE_INVALID
    )
    private String formType;

    @NotNull(message = TemplateConstants.MSG_FORM_DATA_NOT_NULL)
    private Map<String, Object> formData;
}