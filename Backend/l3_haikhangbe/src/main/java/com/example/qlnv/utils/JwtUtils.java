package com.example.qlnv.utils;

import com.example.qlnv.dto.auth.TokenPayloadDto;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    private final String jwtSecret = "qP2$sT8*vX1!zY5@wR7#uQ4^oN9&mK3(jH6)gF0-dC2+bA8=lE4_iM1~hV7%xZ9c";

    private final Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

    private final long EXPIRATION_TIME = 30L * 60 * 60 * 1000;

    public String generateToken(TokenPayloadDto user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("id", user.getId())
                .claim("fullName", user.getFullName())
                .claim("positionName", user.getPositionName())
                .claim("roles", user.getRoles())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token){
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
    }
}