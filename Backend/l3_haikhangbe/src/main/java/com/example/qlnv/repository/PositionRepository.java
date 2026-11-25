package com.example.qlnv.repository;

import com.example.qlnv.dto.position.response.PositionResponseDto;
import com.example.qlnv.entity.Position;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.UUID;

public interface PositionRepository extends Repository<Position, UUID> {

    @Query(value = "SELECT * FROM get_all_positions()", nativeQuery = true)
    List<PositionResponseDto> findAllPositionsFromFunc();

}