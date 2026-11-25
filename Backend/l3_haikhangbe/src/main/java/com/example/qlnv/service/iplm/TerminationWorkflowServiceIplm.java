package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.TerminationRequest.request.TerminationInitRequestDto;
import com.example.qlnv.service.TerminationFormService;
import com.example.qlnv.service.TerminationRequestService;
import com.example.qlnv.service.TerminationWorkflowService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class TerminationWorkflowServiceIplm implements TerminationWorkflowService {
    private final TerminationRequestService terminationRequestService;
    private final TerminationFormService terminationFormService;

    @Transactional
    public UUID initTerminationDraft(TerminationInitRequestDto payload) {

        TerminationInitRequestDto requestDto = new TerminationInitRequestDto();
        requestDto.setEmployeeId(payload.getEmployeeId());

        UUID requestId = terminationRequestService.createTerminationRequest(requestDto);

        terminationFormService.createTerminationForm(
                requestId,
                payload.getEndDate(),
                payload.getReason()
        );

        return requestId;
    }
}
