package com.example.qlnv.utils;

import com.example.qlnv.dto.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class SecurityUtils {
    private SecurityUtils() {
    }

public static String getCurrentUsername() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }

    return null;
}

    public static String getCurrentUserIdString() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return userDetails.getId();
        }

        return null;
    }

    public static UUID getCurrentUserIdAsUUID() {
        String idString = getCurrentUserIdString();

        if (idString != null && !idString.isEmpty()) {
            try {
                return UUID.fromString(idString);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }

        return null;
    }
}