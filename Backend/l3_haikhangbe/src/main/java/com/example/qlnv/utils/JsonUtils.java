package com.example.qlnv.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonUtils {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private JsonUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    static {
        MAPPER.registerModule(new JavaTimeModule());
    }
    public static String toJsonString(Object object) {
        if (object == null) {
            return null;
        }
        try {
            return MAPPER.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            System.err.println("Lỗi parse JSON: " + e.getMessage());
            return null;
        }
    }

    public static Object toObject(String data){
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            return objectMapper.readValue(data, Object.class);
        } catch (Exception e) {
            return null;
        }
    }
}