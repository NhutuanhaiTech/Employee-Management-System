package com.example.qlnv.dto;

import com.example.qlnv.constant.PaginationConstants;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class BasePageRequestDto {

    @Min(value = PaginationConstants.MIN_PAGE, message = PaginationConstants.MSG_PAGE_MIN)
    private Integer page = PaginationConstants.DEFAULT_PAGE;

    @Min(value = PaginationConstants.MIN_SIZE, message = PaginationConstants.MSG_SIZE_MIN)
    @Max(value = PaginationConstants.MAX_SIZE, message = PaginationConstants.MSG_SIZE_MAX)
    private Integer size = PaginationConstants.DEFAULT_SIZE;
}