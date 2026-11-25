package com.example.qlnv.repository;

import com.example.qlnv.dto.template.response.TemplateResponseDto;
import com.example.qlnv.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TemplateRepository extends JpaRepository<Template, UUID> {

    @Query(value = "SELECT func_insert_template(:employeeId, :formType, CAST(:formData AS jsonb), :createdBy)", nativeQuery = true)
    UUID insertTemplate(
            @Param("employeeId") UUID employeeId,
            @Param("formType") String formType,
            @Param("formData") String formData,
            @Param("createdBy") String createdBy
    );


    @Modifying
    @Query(value = "CALL sp_update_template(:pId, CAST(:pFormData AS JSONB), :pUpdatedBy)", nativeQuery = true)
    void updateTemplate(
            @Param("pId") UUID pId,
            @Param("pFormData") String pFormData,
            @Param("pUpdatedBy") String pUpdatedBy
    );

    @Query(value = "SELECT * FROM func_get_templates_by_employee_id(:employeeId)", nativeQuery = true)
    List<TemplateResponseDto> getTemplatesByEmployeeId(@Param("employeeId") UUID employeeId);

    @Modifying
    @Query(value = "CALL sp_update_template_comment(:templateId, :leaderId, :comment)", nativeQuery = true)
    void updateTemplateLeaderComment(
            @Param("templateId") UUID templateId,
            @Param("leaderId") UUID leaderId,
            @Param("comment") String comment
    );
}