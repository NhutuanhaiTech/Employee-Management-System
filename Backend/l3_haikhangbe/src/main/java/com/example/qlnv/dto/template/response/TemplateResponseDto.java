package com.example.qlnv.dto.template.response;

import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TemplateResponseDto {
    private UUID id;
    private UUID employeeId;
    private String formType;
    private String status;
    @JsonRawValue
    private String formData;
    private String leaderComment;
}