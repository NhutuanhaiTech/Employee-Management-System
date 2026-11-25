package com.example.qlnv.controller;

import com.example.qlnv.constant.SalaryIncreaseDecisionConstants;
import com.example.qlnv.dto.ResponseDto;
import com.example.qlnv.dto.SalaryIncreaseDecision.request.SalaryDecisionInsertRequestDto;
import com.example.qlnv.dto.SalaryIncreaseDecision.request.SalaryDecisionLeaderCommentRequestDto;
import com.example.qlnv.dto.SalaryIncreaseDecision.request.SalaryDecisionUpdateRequestDto;
import com.example.qlnv.dto.SalaryIncreaseDecision.response.SalaryDecisionResponseDto;
import com.example.qlnv.service.SalaryDecisionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/salary-increase-decisions")
@RequiredArgsConstructor
public class SalaryDecisionController {

    private final SalaryDecisionService salaryDecisionService;

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/{decisionId}/leader-comment", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<String>> updateLeaderComment(
            @PathVariable("decisionId") UUID decisionId,
            @Valid @RequestBody SalaryDecisionLeaderCommentRequestDto request) {

        salaryDecisionService.updateLeaderComment(decisionId, request.getLeaderComment());

        return new ResponseEntity<>(
                new ResponseDto<>(
                        SalaryIncreaseDecisionConstants.UPDATE_SUCCESS
                ),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<ResponseDto<UUID>> createSalaryIncreaseDecision(
            @Valid @RequestBody SalaryDecisionInsertRequestDto request) {

        UUID newDecisionId = salaryDecisionService.createSalaryIncreaseDecision(request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                SalaryIncreaseDecisionConstants.CREATE_SUCCESS,
                newDecisionId
        ),
                HttpStatus.CREATED
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(value = "/by-request/{requestId}", method = RequestMethod.PUT)
    public ResponseEntity<ResponseDto<UUID>> updateSalaryIncreaseDecision(
            @PathVariable("requestId") UUID requestId,
            @Valid @RequestBody SalaryDecisionUpdateRequestDto request) {

        UUID updatedDecisionId = salaryDecisionService.updateSalaryIncreaseDecision(requestId, request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        SalaryIncreaseDecisionConstants.UPDATE_SUCCESS,
                        updatedDecisionId
                ),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAnyRole('LEADER', 'MANAGER')")
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<ResponseDto<SalaryDecisionResponseDto>> getSalaryIncreaseDecisionByRequestId(
            @RequestParam("requestId") UUID requestId) {

        SalaryDecisionResponseDto responseDto = salaryDecisionService.getSalaryIncreaseDecisionByRequestId(requestId);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        SalaryIncreaseDecisionConstants.GET_DETAIL_SUCCESS,
                        responseDto
                ),
                HttpStatus.OK
        );
    }


}