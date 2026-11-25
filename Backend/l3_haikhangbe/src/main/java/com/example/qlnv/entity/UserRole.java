package com.example.qlnv.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tbl_user_role")
@IdClass(UserRoleId.class)
@Getter
@Setter
@NoArgsConstructor
public class UserRole {

    @Id
    @Column(name = "id_user")
    private UUID userId;

    @Id
    @Column(name = "id_role")
    private UUID roleId;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
}