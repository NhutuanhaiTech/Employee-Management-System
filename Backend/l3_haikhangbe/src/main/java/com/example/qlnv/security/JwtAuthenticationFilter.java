package com.example.qlnv.security;

import com.example.qlnv.dto.security.CustomUserDetails;
import com.example.qlnv.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Autowired
    public JwtAuthenticationFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
        throws ServletException, IOException {

    String authToken = request.getHeader("Authorization");

    if (authToken != null && authToken.startsWith("Bearer ")) {
        String token = authToken.substring(7);

        try {
            if (jwtUtils.validateToken(token)) {
                    Claims claims = jwtUtils.getClaimsFromToken(token);
                    String username = claims.getSubject();
                    String idObj = claims.get("id", String.class);
                    List<GrantedAuthority> authorities;

                    List<String> roles = claims.get("roles", List.class);
                    if(roles != null) {
                        authorities = roles.stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                                .collect(Collectors.toList());
                    } else {
                        authorities = List.of();
                    }
                    CustomUserDetails details = new CustomUserDetails(username, idObj);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(details, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");

            String jsonString = String.format(
                    "{\"status\": 401, \"error\": \"Unauthorized\", \"message\": \"%s\"}",
                    e.getMessage().replace("\"", "\\\"")
            );
            response.getWriter().write(jsonString);
            return;
        }
    }

    filterChain.doFilter(request, response);
    }
}