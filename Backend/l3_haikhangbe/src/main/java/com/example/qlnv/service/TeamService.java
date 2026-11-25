package com.example.qlnv.service;

import com.example.qlnv.dto.team.response.TeamResponseDto;
import java.util.List;

public interface TeamService {
    List<TeamResponseDto> getAllTeams();
}