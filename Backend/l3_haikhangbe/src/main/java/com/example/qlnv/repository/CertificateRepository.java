package com.example.qlnv.repository;

import com.example.qlnv.dto.employee.response.EmployeeCertificateResponseDto;
import com.example.qlnv.entity.Certificate;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Repository
public interface CertificateRepository extends Repository<Certificate, UUID> {

    @Modifying
    @Query(
            value = "CALL sp_insert_certificates(:employeeId, CAST(:certificatesJson AS jsonb), :maxTotal, :maxField)",
            nativeQuery = true
    )
    void insertCertificates(
            @Param("employeeId") UUID employeeId,
            @Param("certificatesJson") String certificatesJson,
            @Param("maxTotal") int maxTotal,
            @Param("maxField") int maxField
    );

    @Modifying
    @Query(
            value = "CALL sp_delete_employee_certificates(:employeeId)",
            nativeQuery = true
    )
    void deleteCertificates(
            @Param("employeeId") UUID employeeId
    );

    @Query(
            value = "SELECT * FROM func_get_certificates_by_employee_id(:employeeId)",
            nativeQuery = true
    )
    List<EmployeeCertificateResponseDto> getCertificatesByEmployeeId(
            @Param("employeeId") UUID employeeId
    );
}