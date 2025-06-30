package com.budgetwise.backend.common;

import com.budgetwise.backend.dto.ApiErrorResponse;
import com.budgetwise.backend.services.JwtService;
import com.budgetwise.backend.services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private final UserService userService;
	private final JwtService jwtService;
	private final ObjectMapper objectMapper;

	public JwtAuthFilter(UserService userService, JwtService jwtService, ObjectMapper objectMapper) {
		this.userService = userService;
		this.jwtService = jwtService;
		this.objectMapper = objectMapper;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			Cookie[] cookies = request.getCookies();
			String token = null;
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					if ("USER_SESSSION".equals(cookie.getName())) {
						token = cookie.getValue();
					}
				}
			}
			if (token == null) {
				filterChain.doFilter(request, response);
				return;
			}

			if (SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails = userService.loadUserByUsername(jwtService.extractUsername(token));
				if (jwtService.isTokenValid(token, userDetails)) {
					UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
							userDetails, null, userDetails.getAuthorities());
					authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authenticationToken);
				}
			}

			filterChain.doFilter(request, response);
		} catch (AccessDeniedException e) {
			Cookie cookie = new Cookie("USER_SESSSION", null);
			cookie.setPath("/");
			cookie.setHttpOnly(true);
			cookie.setSecure(true);
			cookie.setMaxAge(0);
			response.addCookie(cookie);
			ApiErrorResponse errorResponse = new ApiErrorResponse(HttpServletResponse.SC_FORBIDDEN, e.getMessage());
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			response.getWriter().write(toJson(errorResponse));
		}
	}

	private String toJson(ApiErrorResponse response) {
		try {
			return objectMapper.writeValueAsString(response);
		} catch (JsonProcessingException e) {
			log.error("An error occurred while converting the object to json", e);
			return "";
		}
	}
}
