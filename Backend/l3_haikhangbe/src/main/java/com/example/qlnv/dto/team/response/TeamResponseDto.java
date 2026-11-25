package com.example.qlnv.dto.team.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponseDto {
    private UUID id;
    private String teamName;
}