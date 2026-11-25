package com.example.qlnv.controller;

import com.example.qlnv.constant.TerminationFormConstants;
import com.example.qlnv.dto.ResponseDto;
import com.example.qlnv.dto.TerminationForm.request.TerminationFormUpdateRequestDto;
import com.example.qlnv.dto.TerminationForm.request.TerminationLeaderCommentRequestDto;
import com.example.qlnv.dto.TerminationForm.response.TerminationFormResponseDto;
import com.example.qlnv.service.TerminationFormService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/termination-forms")
@RequiredArgsConstructor
public class TerminationFormController {

    private final TerminationFormService terminationFormService;

    @PreAuthorize("hasAnyRole('LEADER', 'MANAGER')")
    @RequestMapping(value = "/by-employee/{employeeId}", method = RequestMethod.GET)
    public ResponseEntity<ResponseDto<TerminationFormResponseDto>> getTerminationForms(
            @PathVariable("employeeId") UUID employeeId) {
        TerminationFormResponseDto forms = terminationFormService.getTerminationFormsByEmployeeId(employeeId);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        TerminationFormConstants.MSG_GET_SUCCESS, forms),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(value = "/{formId}", method = RequestMethod.PUT)
    public ResponseEntity<ResponseDto<Void>> updateTerminationForm(
            @PathVariable("formId") UUID formId,
            @Valid @RequestBody TerminationFormUpdateRequestDto request) {
        terminationFormService.updateTerminationForm(formId, request);
        return new ResponseEntity<>(
                new ResponseDto<>(
                        TerminationFormConstants.MSG_UPDATE_SUCCESS, null),
                HttpStatus.OK
        );
    }
    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/{requestId}/leader-comment", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<Void>> updateLeaderComment(
            @PathVariable UUID requestId,
            @Valid @RequestBody TerminationLeaderCommentRequestDto request) {

        terminationFormService.updateLeaderComment(requestId, request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        TerminationFormConstants.MSG_UPDATE_COMMENT_SUCCESS, null),
                HttpStatus.OK
        );
    }
}