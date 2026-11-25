package com.example.qlnv.dto.position.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PositionResponseDto {
    private UUID id;
    private String positionName;
}