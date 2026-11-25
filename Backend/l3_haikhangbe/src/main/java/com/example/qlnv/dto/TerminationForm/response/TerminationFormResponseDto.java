package com.example.qlnv.dto.TerminationForm.response;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TerminationFormResponseDto {
    private UUID id;
    private UUID requestId;
    private LocalDate endDate;
    private String reason;
    private String toDepartment;
    private String subject;
    private String handoverContent;
    private String leaderComment;
}
