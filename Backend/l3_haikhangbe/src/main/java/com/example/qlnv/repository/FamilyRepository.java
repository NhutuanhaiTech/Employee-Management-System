package com.example.qlnv.repository;

import com.example.qlnv.dto.employee.response.EmployeeFamilyResponseDto;
import com.example.qlnv.entity.FamilyRelationship;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface FamilyRepository extends Repository<FamilyRelationship, UUID> {

    @Modifying
    @Query(
            value = "CALL sp_insert_family_relationships(:employeeId, CAST(:familyJson AS jsonb), :total)",
            nativeQuery = true
    )
    void insertFamilyRelationships(
            @Param("employeeId") UUID employeeId,
            @Param("familyJson") String familyJson,
            @Param("total") Integer total
    );

    @Modifying
    @Query(
            value = "CALL sp_delete_employee_family_relationships(:employeeId)",
            nativeQuery = true
    )
    void deleteFamilyRelationships(
            @Param("employeeId") UUID employeeId
    );
    @Query(
            value = "SELECT * FROM func_get_family_relationships_by_employee_id(:employeeId)",
            nativeQuery = true
    )
    List<EmployeeFamilyResponseDto> getFamilyRelationshipsByEmployeeId(
            @Param("employeeId") UUID employeeId
    );
}