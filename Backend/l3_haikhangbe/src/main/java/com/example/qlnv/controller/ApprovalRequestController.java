package com.example.qlnv.controller;

import com.example.qlnv.constant.ApprovalContants;
import com.example.qlnv.dto.ResponseDto;
import com.example.qlnv.dto.SearchStatusDto;
import com.example.qlnv.dto.approvalRequest.request.ApprovalDecisionRequestDto;
import com.example.qlnv.dto.approvalRequest.request.ApprovalFeedbackRequestDto;
import com.example.qlnv.dto.approvalRequest.request.ApprovalInsertUpdateRequestDto;
import com.example.qlnv.dto.approvalRequest.response.ApprovalResponseDto;
import com.example.qlnv.service.ApprovalRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/approval-requests")
@RequiredArgsConstructor
public class ApprovalRequestController {

    private final ApprovalRequestService approvalRequestService;

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<ResponseDto<UUID>> createApprovalRequest(@Valid @RequestBody ApprovalInsertUpdateRequestDto request) {
        UUID newRequestId = approvalRequestService.createApprovalRequest(request);
        return new ResponseEntity<>(
                new ResponseDto<>( ApprovalContants.MSG_CREATE_SUCCESS, newRequestId),
                HttpStatus.CREATED
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<ResponseDto<Void>> updateApprovalRequest(@Valid @RequestBody ApprovalInsertUpdateRequestDto request) {
        approvalRequestService.updateApprovalRequest(request);

        return new ResponseEntity<>(
                new ResponseDto<>(ApprovalContants.MSG_UPDATE_SUCCESS, null),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<ResponseDto<List<ApprovalResponseDto>>> getApprovalRequestsPaginated(
            @Valid @ModelAttribute SearchStatusDto dto
            ) {
        List<ApprovalResponseDto> response = approvalRequestService.getApprovalRequestsPaginated(dto);
        return new ResponseEntity<>(new ResponseDto<>(ApprovalContants.MSG_GET_ALL_APPROVAL_SUCCESS,
                response
                ), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/{id}/approve", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<Void>> approveRequest(
            @PathVariable UUID id,
            @Valid @RequestBody ApprovalDecisionRequestDto requestDto
    ) {
        approvalRequestService.approveRequest(id, requestDto);
        return new ResponseEntity<>(
                new ResponseDto<>(ApprovalContants.MSG_APPROVE_SUCCESS, null),
                HttpStatus.OK
        );
    }
    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/{id}/require-update", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<Void>> requireUpdate(
            @PathVariable UUID id,
            @Valid @RequestBody ApprovalFeedbackRequestDto requestDto
    ) {
        approvalRequestService.requireUpdate(id, requestDto);
        return new ResponseEntity<>(
                new ResponseDto<>(ApprovalContants.MSG_REQUIRE_UPDATE_SUCCESS, null),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('LEADER')")
    @RequestMapping(value = "/{id}/reject", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseDto<Void>> rejectRequest(
            @PathVariable UUID id,
            @Valid @RequestBody ApprovalFeedbackRequestDto requestDto
    ) {
        approvalRequestService.rejectRequest(id, requestDto);
        return new ResponseEntity<>(
                new ResponseDto<>(ApprovalContants.MSG_REJECT_SUCCESS, null),
                HttpStatus.OK
        );
    }
}