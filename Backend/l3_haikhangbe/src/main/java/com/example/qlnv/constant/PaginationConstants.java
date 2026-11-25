package com.example.qlnv.constant;

public class PaginationConstants {
    private PaginationConstants() {}

    public static final int DEFAULT_PAGE = 1;
    public static final int DEFAULT_SIZE = 10;

    public static final int MIN_PAGE = 1;
    public static final int MIN_SIZE = 1;
    public static final int MAX_SIZE = 15;

    public static final String MSG_PAGE_MIN = "Page phải từ " + MIN_PAGE + " trở lên";
    public static final String MSG_SIZE_MIN = "Size tối thiểu là " + MIN_SIZE;
    public static final String MSG_SIZE_MAX = "Size tối đa là " + MAX_SIZE;
}