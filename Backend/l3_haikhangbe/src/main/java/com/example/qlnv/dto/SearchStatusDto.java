package com.example.qlnv.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchStatusDto extends BasePageRequestDto {
    private String status;
}