package com.example.qlnv.dto.employee.request;

import com.example.qlnv.constant.EmployeeConstants;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeInsertRequestDto {

    @NotBlank(message = EmployeeConstants.VAL_CODE_NOT_BLANK)
    @Size(min = EmployeeConstants.LENGTH_CODE ,max = EmployeeConstants.LENGTH_CODE, message = EmployeeConstants.VAL_CODE_SIZE)
    private String employeeCode;

    @NotBlank(message = EmployeeConstants.VAL_NAME_NOT_BLANK)
    @Size(min = EmployeeConstants.MIN_LENGTH_NAME, max = EmployeeConstants.MAX_LENGTH_FULL_NAME, message = EmployeeConstants.VAL_NAME_SIZE)
    private String fullName;

    @NotBlank(message = EmployeeConstants.VAL_GENDER_NOT_BLANK)
    @Pattern(regexp = EmployeeConstants.REGEX_GENDER, message = EmployeeConstants.VAL_GENDER_PATTERN)
    private String gender;

    @NotNull(message = EmployeeConstants.VAL_DOB_NOT_NULL)
    @Past(message = EmployeeConstants.VAL_DOB_PAST)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dob;

    @NotBlank(message = EmployeeConstants.VAL_ADDRESS_NOT_BLANK)
    @Size(max = EmployeeConstants.MAX_LENGTH_ADDRESS, message = EmployeeConstants.VAL_ADDRESS_SIZE)
    private String address;

    @URL(message = EmployeeConstants.VAL_AVATAR_URL_INVALID)
    @Size(max = EmployeeConstants.MAX_LENGTH_AVATAR_URL, message = EmployeeConstants.VAL_AVATAR_URL_SIZE)
    private String avatarUrl;

    @NotBlank(message = EmployeeConstants.VAL_ID_NUMBER_NOT_BLANK)
    @Pattern(regexp = EmployeeConstants.REGEX_ID_NUMBER, message = EmployeeConstants.VAL_ID_NUMBER_PATTERN)
    private String idNumber;

    @NotBlank(message = EmployeeConstants.VAL_PHONE_NOT_BLANK)
    @Pattern(regexp = EmployeeConstants.REGEX_PHONE_VN, message = EmployeeConstants.VAL_PHONE_PATTERN)
    private String phone;

    @NotBlank(message = EmployeeConstants.VAL_EMAIL_NOT_BLANK)
    @Email(message = EmployeeConstants.VAL_EMAIL_INVALID)
    @Size(max = EmployeeConstants.MAX_LENGTH_EMAIL, message = EmployeeConstants.VAL_EMAIL_SIZE)
    private String email;

    @NotNull(message = EmployeeConstants.VAL_TEAM_ID_NOT_NULL)
    private UUID teamId;

    private String createBy;
    private String updateBy;

    @Valid
    private List<EmployeeCertificateRequestDto> certificates;

    @Valid
    private List<EmployeeFamilyRequestDto> familyRelationships;
}