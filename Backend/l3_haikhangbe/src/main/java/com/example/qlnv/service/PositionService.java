package com.example.qlnv.service;

import com.example.qlnv.dto.position.response.PositionResponseDto;
import java.util.List;

public interface PositionService {
    List<PositionResponseDto> getAllPositions();
}