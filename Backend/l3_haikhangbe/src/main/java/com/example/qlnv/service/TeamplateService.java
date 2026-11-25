package com.example.qlnv.service;

import com.example.qlnv.dto.template.request.TemplateCreateRequestDto;
import com.example.qlnv.dto.template.request.TemplateLeaderCommentRequestDto;
import com.example.qlnv.dto.template.response.TemplateResponseDto;
import com.example.qlnv.dto.template.request.TemplateUpdateRequestDto;

import java.util.List;
import java.util.UUID;

public interface TeamplateService {
    UUID createTemplate(TemplateCreateRequestDto request);
    void updateTemplate(UUID id, TemplateUpdateRequestDto dto);
    List<TemplateResponseDto> getTemplatesByEmployeeId(UUID employeeId);
    void updateLeaderComment(UUID templateId, TemplateLeaderCommentRequestDto dto);

}
