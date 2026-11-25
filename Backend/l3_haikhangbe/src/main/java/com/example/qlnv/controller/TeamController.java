package com.example.qlnv.controller;

import com.example.qlnv.dto.team.response.TeamResponseDto;
import com.example.qlnv.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PreAuthorize("hasAnyRole('MANAGER', 'LEADER')")
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<TeamResponseDto>> getAllTeams() {
        return new ResponseEntity<>(teamService.getAllTeams(), HttpStatus.OK);
    }
}