package com.example.qlnv.repository;

import com.example.qlnv.dto.team.response.TeamResponseDto;
import com.example.qlnv.entity.Team;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.UUID;

public interface TeamRepository extends Repository<Team, UUID> {
    @Query(value = "SELECT * FROM get_all_teams()", nativeQuery = true)
    List<TeamResponseDto> findAllTeamsFromFunc();
}