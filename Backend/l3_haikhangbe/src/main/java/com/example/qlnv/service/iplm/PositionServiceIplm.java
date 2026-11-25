package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.position.response.PositionResponseDto;
import com.example.qlnv.repository.PositionRepository;
import com.example.qlnv.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionServiceIplm implements PositionService {

    private final PositionRepository positionRepository;

    @Override
    public List<PositionResponseDto> getAllPositions() {
        return positionRepository.findAllPositionsFromFunc();
    }
}