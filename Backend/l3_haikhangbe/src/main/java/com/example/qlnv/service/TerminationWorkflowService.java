package com.example.qlnv.service;

import com.example.qlnv.dto.TerminationRequest.request.TerminationInitRequestDto;

import java.util.UUID;

public interface TerminationWorkflowService {
    UUID initTerminationDraft(TerminationInitRequestDto payload);
}
