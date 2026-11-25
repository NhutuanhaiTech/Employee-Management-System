package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.template.request.TemplateCreateRequestDto;
import com.example.qlnv.dto.template.request.TemplateLeaderCommentRequestDto;
import com.example.qlnv.dto.template.response.TemplateResponseDto;
import com.example.qlnv.dto.template.request.TemplateUpdateRequestDto;
import com.example.qlnv.repository.TemplateRepository;
import com.example.qlnv.service.TeamplateService;
import com.example.qlnv.utils.JsonUtils;
import com.example.qlnv.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TemplateServiceIplm implements TeamplateService {

    private final TemplateRepository templateRepository;

    @Transactional
    @Override
    public UUID createTemplate(TemplateCreateRequestDto request) {
            return this.templateRepository.insertTemplate(
                    request.getEmployeeId(),
                    request.getFormType(),
                    JsonUtils.toJsonString(request.getFormData()),
                    SecurityUtils.getCurrentUsername()
            );
    }

    @Override
    @Transactional
    public void updateTemplate(UUID id, TemplateUpdateRequestDto dto) {
            String username = SecurityUtils.getCurrentUsername();
            this.templateRepository.updateTemplate(
                    id,
                    JsonUtils.toJsonString(dto.getFormData()),
                    username
            );
    }
    @Override
    public List<TemplateResponseDto> getTemplatesByEmployeeId(UUID employeeId) {
        return this.templateRepository.getTemplatesByEmployeeId(employeeId);
    }
    @Override
    @Transactional
    public void updateLeaderComment(UUID templateId, TemplateLeaderCommentRequestDto dto) {
        UUID leaderId = SecurityUtils.getCurrentUserIdAsUUID();
        this.templateRepository.updateTemplateLeaderComment(
                templateId,
                leaderId,
                dto.getComment()
        );
    }
}