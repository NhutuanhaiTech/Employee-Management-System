package com.example.qlnv.controller;

import com.example.qlnv.constant.TemplateConstants;
import com.example.qlnv.dto.ResponseDto;
import com.example.qlnv.dto.template.request.TemplateCreateRequestDto;
import com.example.qlnv.dto.template.request.TemplateLeaderCommentRequestDto;
import com.example.qlnv.dto.template.response.TemplateResponseDto;
import com.example.qlnv.dto.template.request.TemplateUpdateRequestDto;
import com.example.qlnv.service.TeamplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TeamplateService templateService;

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<ResponseDto<UUID>> createTemplate(
            @Valid @RequestBody TemplateCreateRequestDto request) {
        UUID newTemplateId = templateService.createTemplate(request);
        return new ResponseEntity<>(
                new ResponseDto<>(TemplateConstants.MSG_INSERT_SUCCESS, newTemplateId),
                HttpStatus.CREATED
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<UUID>> updateTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody TemplateUpdateRequestDto request) {
            templateService.updateTemplate(id, request);
            return new ResponseEntity<>(
                    new ResponseDto<>(TemplateConstants.MSG_UPDATE_SUCCES),
                    HttpStatus.OK
            );
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'LEADER')")
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<ResponseDto<List<TemplateResponseDto>>> getTemplatesByEmployeeId(
            @RequestParam("employeeId") UUID employeeId) {
        List<TemplateResponseDto> data = templateService.getTemplatesByEmployeeId(employeeId);
        return new ResponseEntity<>(
                new ResponseDto<>(TemplateConstants.MSG_GET_SUCCESS, data),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/{id}/leader-comment", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<Void>> updateLeaderComment(
            @PathVariable("id") UUID id,
            @Valid @RequestBody TemplateLeaderCommentRequestDto request) {

        templateService.updateLeaderComment(id, request);

        return new ResponseEntity<>(
                new ResponseDto<>(TemplateConstants.MSG_UPDATE_SUCCES),
                HttpStatus.OK
        );
    }
}