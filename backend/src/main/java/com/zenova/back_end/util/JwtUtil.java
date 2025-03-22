package com.zenova.back_end.util;

import com.zenova.back_end.dto.UserDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@PropertySource(ignoreResourceNotFound = true, value = "classpath:application.properties")
public class JwtUtil implements Serializable {

    private static final long serialVersionUID = 234234523523L;
    public static final long JWT_TOKEN_VALIDITY = 24 * 60 * 60 * 12;

    @Value("${jwt.secret}")
    private String secretKey;

    public String getUsernameFromToken(String token) {
        System.out.println("===================getUserNameFromToken===============================================");
        System.out.println("Validating with Secret Key: " + secretKey); // Log the secret key
        System.out.println("Token: " + token); // Log the token
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Claims getUserRoleCodeFromToken(String token) {
        System.out.println("===============================================================================");
        System.out.println("Validating with Secret Key: " + secretKey); // Log the secret key
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        System.out.println("====================getClaimFromToken==============================================");
        System.out.println("Claims: " + claims); // Log the claims
        return claimsResolver.apply(claims);
    }

    public Claims getAllClaimsFromToken(String token) {
        System.out.println("Validating with Secret Key: " + secretKey); // Log the secret key
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        System.out.println("Token Expiration: " + expiration); // Logging
        return expiration.before(new Date());
    }

    public String generateToken(@Valid UserDTO userDTO) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "ROLE_" + userDTO.getRole()); // Ensure ROLE_ prefix is added
        System.out.println("Using Secret Key: " + secretKey); // Log the secret key
        return doGenerateToken(claims, userDTO.getEmail());
    }

    private String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .signWith(SignatureAlgorithm.HS512, secretKey).compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
