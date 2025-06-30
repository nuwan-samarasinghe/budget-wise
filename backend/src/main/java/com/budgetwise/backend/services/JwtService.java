package com.budgetwise.backend.services;

import com.budgetwise.backend.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecureDigestAlgorithm;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.expirationMs}")
	private long expMs;

	private SecretKey signingKey;
	private SecureDigestAlgorithm<SecretKey, ?> algorithm;

	@PostConstruct
	private void init() {
		this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.algorithm = Jwts.SIG.HS256;
	}

	public String generateToken(User user) {
		var now = Instant.now();
		return Jwts.builder().subject(user.getUsername()).issuedAt(Date.from(now))
				.expiration(Date.from(now.plus(expMs, ChronoUnit.MINUTES))).signWith(signingKey, algorithm).compact();
	}

	public String extractUsername(String token) {
		return getTokenBody(token).getSubject();
	}

	public boolean isTokenValid(String token, UserDetails user) {
		return extractUsername(token).equals(user.getUsername()) && !isTokenExpired(token);
	}

	private Claims getTokenBody(String token) {
		try {
			return Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload();
		} catch (Exception e) {
			throw new AccessDeniedException("Access denied: " + e.getMessage());
		}
	}

	private boolean isTokenExpired(String token) {
		return getTokenBody(token).getExpiration().before(new Date());
	}
}
