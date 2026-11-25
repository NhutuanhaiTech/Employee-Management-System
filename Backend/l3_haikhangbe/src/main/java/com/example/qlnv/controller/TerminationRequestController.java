package com.example.qlnv.controller;

import com.example.qlnv.constant.TerminationRequestConstants;
import com.example.qlnv.dto.ResponseDto;
import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.TerminationRequest.request.*;
import com.example.qlnv.dto.TerminationRequest.response.TerminationRequestLeaderResponseDto;
import com.example.qlnv.service.TerminationRequestService;
import com.example.qlnv.service.iplm.TerminationWorkflowServiceIplm;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/termination-requests")
@RequiredArgsConstructor
public class TerminationRequestController {

    private final TerminationRequestService terminationRequestService;

    private final TerminationWorkflowServiceIplm terminationWorkflowService;

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(value = "/init-draft", method = RequestMethod.POST)
    public ResponseEntity<ResponseDto<UUID>> initTerminationDraft(
            @Valid @RequestBody TerminationInitRequestDto request) {

        UUID newRequestId = terminationWorkflowService.initTerminationDraft(request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        TerminationRequestConstants.MSG_INIT_SUCCESS, newRequestId),
                HttpStatus.CREATED
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(value = "/submit", method = RequestMethod.POST)
    public ResponseEntity<ResponseDto<Void>> submitTerminationRequest(
            @Valid @RequestBody TerminationSubmitRequestDto request) {

        terminationRequestService.submitTerminationRequest(request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        TerminationRequestConstants.MSG_SUBMIT_SUCCESS, null),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/for-leader", method = RequestMethod.GET)
    public ResponseEntity<ResponseDto<List<TerminationRequestLeaderResponseDto>>> getRequestsForLeader(
            @ModelAttribute SearchStatusDto searchStatusDto) {

        List<TerminationRequestLeaderResponseDto> list = terminationRequestService.getRequestsForLeader(searchStatusDto);
        return new ResponseEntity<>(
                new ResponseDto<>(
                        TerminationRequestConstants.MSG_GET_LIST_SUCCESS, list),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/{requestId}/approve", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<Void>> approveTerminationRequest(
            @PathVariable UUID requestId,
            @Valid @RequestBody TerminationApproveRequestDto request) {

        terminationRequestService.approveTerminationRequest(requestId, request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        TerminationRequestConstants.MSG_APPROVE_SUCCESS, null),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/{requestId}/reject", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<Void>> rejectTerminationRequest(
            @PathVariable UUID requestId,
            @Valid @RequestBody TerminationRejectRequestDto request) {

        terminationRequestService.rejectTerminationRequest(requestId, request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        TerminationRequestConstants.MSG_REJECT_SUCCESS, null),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/{requestId}/require-update", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<Void>> requireUpdateTerminationRequest(
            @PathVariable UUID requestId,
            @Valid @RequestBody TerminationRequireUpdateRequestDto request) {

        terminationRequestService.requireUpdateTerminationRequest(requestId, request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        TerminationRequestConstants.MSG_REQUIRE_UPDATE_SUCCESS, null),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(value = "/resubmit", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<Void>> resubmitTerminationRequest(
            @Valid @RequestBody TerminationResubmitRequestDto request) {

        terminationRequestService.resubmitTerminationRequest(request);

        return new ResponseEntity<>(
                new ResponseDto<>(
                        TerminationRequestConstants.MSG_RESUBMIT_SUCCESS, null),
                HttpStatus.OK
        );
    }
}