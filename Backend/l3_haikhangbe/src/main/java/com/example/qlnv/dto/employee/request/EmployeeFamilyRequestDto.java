package com.example.qlnv.dto.employee.request;

import com.example.qlnv.constant.EmployeeConstants;
import com.example.qlnv.enums.RelationshipType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeFamilyRequestDto {

    @NotBlank(message = EmployeeConstants.VAL_FAMILY_NAME_NOT_BLANK)
    @Size(min = EmployeeConstants.MIN_LENGTH_NAME, max = EmployeeConstants.MAX_LENGTH_FULL_NAME, message = EmployeeConstants.VAL_FAMILY_NAME_SIZE)
    private String fullName;

    @NotBlank(message = EmployeeConstants.VAL_GENDER_NOT_BLANK)
    @Pattern(regexp = EmployeeConstants.REGEX_GENDER, message = EmployeeConstants.VAL_FAMILY_GENDER_PATTERN)
    private String gender;

    @NotNull(message = EmployeeConstants.VAL_DOB_NOT_NULL)
    @Past(message = EmployeeConstants.VAL_DOB_PAST)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dob;

    @NotBlank(message = EmployeeConstants.VAL_ID_NUMBER_NOT_BLANK)
    @Pattern(regexp = EmployeeConstants.REGEX_ID_NUMBER, message = EmployeeConstants.VAL_ID_NUMBER_PATTERN)
    private String idNumber;

    @NotNull(message = EmployeeConstants.VAL_RELATIONSHIP_NOT_NULL)
    private RelationshipType relationshipType;

    @NotBlank(message = EmployeeConstants.VAL_ADDRESS_NOT_BLANK)
    @Size(max = EmployeeConstants.MAX_LENGTH_ADDRESS, message = EmployeeConstants.VAL_ADDRESS_SIZE)
    private String address;

    @NotBlank(message = EmployeeConstants.VAL_PHONE_NOT_BLANK)
    @Pattern(regexp = EmployeeConstants.REGEX_PHONE_VN, message = EmployeeConstants.VAL_PHONE_PATTERN)
    private String phone;

}