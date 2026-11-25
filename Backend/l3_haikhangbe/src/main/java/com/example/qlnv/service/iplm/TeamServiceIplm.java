package com.example.qlnv.service.iplm;

import com.example.qlnv.dto.team.response.TeamResponseDto;
import com.example.qlnv.repository.TeamRepository;
import com.example.qlnv.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamServiceIplm implements TeamService {

    private final TeamRepository teamRepository;

    @Override
    public List<TeamResponseDto> getAllTeams() {
        return teamRepository.findAllTeamsFromFunc();
    }
}