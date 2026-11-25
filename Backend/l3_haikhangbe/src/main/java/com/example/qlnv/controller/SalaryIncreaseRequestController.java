package com.example.qlnv.controller;

import com.example.qlnv.constant.SalaryRequestConstants;
import com.example.qlnv.dto.BasePageRequestDto;
import com.example.qlnv.dto.ResponseDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.request.*;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryIncreaseHistoryResponseDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryIncreaseResponseDto;
import com.example.qlnv.dto.SalaryIncreaseRequest.response.SalaryRequestForLeaderResponseDto;
import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.service.SalaryIncreaseRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/salary-increase-requests")
@RequiredArgsConstructor
public class SalaryIncreaseRequestController {

    private final SalaryIncreaseRequestService salaryIncreaseRequestService;

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<ResponseDto<UUID>> createSalaryIncreaseRequest(
            @Valid @RequestBody SalaryIncreaseInsertRequestDto request) {

        UUID newRequestId = salaryIncreaseRequestService.createSalaryIncreaseRequest(request);
        return new ResponseEntity<>(
                new ResponseDto<>(SalaryRequestConstants.CREATE_SUCCESS, newRequestId),
                HttpStatus.CREATED
        );
    }

    @PreAuthorize("hasAnyRole('MANAGER')")
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<ResponseDto<List<SalaryIncreaseHistoryResponseDto>>> getSalaryIncreaseHistory(
            @RequestParam(value = "employeeId", required = true) String employeeIdStr,
            @Valid @ModelAttribute BasePageRequestDto pageRequest) {

        List<SalaryIncreaseHistoryResponseDto> historyList =
                salaryIncreaseRequestService.getSalaryIncreaseHistory(
                        UUID.fromString(employeeIdStr),
                        pageRequest
                );

        return new ResponseEntity<>(
                new ResponseDto<>(SalaryRequestConstants.GET_HISTORY_SUCCESS, historyList),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAnyRole('MANAGER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<ResponseDto<SalaryIncreaseResponseDto>> getSalaryIncreaseRequestById(
            @PathVariable("id") UUID id) {

        SalaryIncreaseResponseDto detailResponse = salaryIncreaseRequestService.getSalaryIncreaseRequestById(id);

        return new ResponseEntity<>(
                new ResponseDto<>(SalaryRequestConstants.GET_DETAIL_SUCCESS, detailResponse),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAnyRole('MANAGER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<ResponseDto<UUID>> updateSalaryIncreaseRequest(
            @PathVariable("id") UUID id,
            @Valid @RequestBody SalaryIncreaseUpdateRequestDto request) {

        UUID updatedRequestId = salaryIncreaseRequestService.updateSalaryIncreaseRequest(id, request);

        return new ResponseEntity<>(
                new ResponseDto<>(SalaryRequestConstants.UPDATE_SUCCESS, updatedRequestId),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAnyRole('MANAGER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<ResponseDto<Void>> deleteSalaryIncreaseRequest(
            @PathVariable("id") UUID id) {

        salaryIncreaseRequestService.deleteSalaryIncreaseRequest(id);

        return new ResponseEntity<>(
                new ResponseDto<>(SalaryRequestConstants.DELETE_SUCCESS, null),
                HttpStatus.OK
        );
    }
    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(value = "/{id}/submit", method = RequestMethod.POST)
    public ResponseEntity<ResponseDto<Void>> submitDraftSalaryIncreaseRequest(
            @PathVariable("id") UUID id,
            @Valid @RequestBody SalarySubmitDraftRequestDto request) {

        salaryIncreaseRequestService.submitDraftSalaryIncreaseRequest(id, request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        SalaryRequestConstants.SUBMIT_SUCCESS,
                        null
                ),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(value = "/{id}/resubmit", method = RequestMethod.POST)
    public ResponseEntity<ResponseDto<Void>> resubmitUpdateRequiredSalaryRequest(
            @PathVariable("id") UUID id,
            @Valid @RequestBody SalaryResubmitRequestDto request) {

        salaryIncreaseRequestService.resubmitUpdateRequiredSalaryRequest(id, request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        SalaryRequestConstants.SUBMIT_SUCCESS,
                        null
                ),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/leader", method = RequestMethod.GET)
    public ResponseEntity<ResponseDto<List<SalaryRequestForLeaderResponseDto>>> getSalaryIncreaseRequestsForLeader(
            @Valid @ModelAttribute SearchStatusDto dto) {

        List<SalaryRequestForLeaderResponseDto> result = salaryIncreaseRequestService.getSalaryIncreaseRequestsForLeader(dto);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        SalaryRequestConstants.GET_LIST_SALARY_REQUEST_SUCCESS,
                        result
                ),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/{id}/respond", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<Void>> respondSalaryIncreaseRequest(
            @PathVariable("id") UUID id,
            @Valid @RequestBody LeaderRespondSalaryRequestDto request) {

        salaryIncreaseRequestService.respondSalaryIncreaseRequest(id, request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        SalaryRequestConstants.RESPOND_SUCCESS,
                        null
                ),
                HttpStatus.OK
        );
    }
}