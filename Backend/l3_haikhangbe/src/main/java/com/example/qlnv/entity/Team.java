package com.example.qlnv.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
@Table(name = "tbl_teams")
public class Team {
    @Id
    private UUID id;

    @Column(name = "team_name")
    private String teamName;
}
