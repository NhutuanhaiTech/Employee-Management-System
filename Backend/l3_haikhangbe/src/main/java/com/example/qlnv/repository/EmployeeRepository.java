package com.example.qlnv.repository;

import com.example.qlnv.dto.employee.EmployeeListItemDto;
import com.example.qlnv.dto.employee.response.EmployeeResponseDto;
import com.example.qlnv.entity.Employee;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Repository
public interface EmployeeRepository extends Repository<Employee, UUID> {
    @Query(
            value = "SELECT func_insert_employee(CAST(:employeeData AS jsonb), :status)",
            nativeQuery = true
    )
    UUID insertEmployee(
            @Param("employeeData") String employeeData,
            @Param("status") String status
    );

    @Modifying
    @Query(
            value = "CALL sp_update_employee(:id, CAST(:employeeData AS jsonb))",
            nativeQuery = true
    )
    void updateEmployee(
            @Param("id") UUID id,
            @Param("employeeData") String employeeData
    );

    @Modifying
    @Query(
            value = "CALL sp_delete_employee(:employeeId, :username)",
            nativeQuery = true
    )
    void deleteEmployeeInfo(
            @Param("employeeId") UUID employeeId,
            @Param("username") String username
    );

    @Query(
            value = "SELECT * FROM func_get_all_employees_paged(:limit, :offset, :status, :isWork)",
            nativeQuery = true
    )
    List<EmployeeListItemDto> getAllEmployeesPaged(
            @Param("limit") int limit,
            @Param("offset") int offset,
            @Param("status") String status,
            @Param("isWork") Boolean isWord
    );

    @Query(
            value = "SELECT func_count_employees(:username)",
            nativeQuery = true
    )
    long countEmployees(
            @Param("username") String username
    );

    @Query(
            value = "SELECT * FROM func_get_employee_by_id(:employeeId)",
            nativeQuery = true
    )
    EmployeeResponseDto getEmployeeById(
            @Param("employeeId") UUID employeeId
    );
}
