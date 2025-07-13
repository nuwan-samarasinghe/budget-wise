package com.budgetwise.backend.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthFilter authFilter;

	public SecurityConfig(JwtAuthFilter authFilter) {
		this.authFilter = authFilter;
	}

	// SonarQube: CSRF token needs to be accessible by the frontend JavaScript to be
	// sent in headers.
	// The CSRF token is not sensitive and this is safe by design in Spring Security
	// for SPAs.
	@SuppressWarnings("java:S3330")
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
				.csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
				.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
						.requestMatchers("/swagger-ui.html").permitAll().requestMatchers("/api-docs").permitAll()
						.requestMatchers("/api-docs/*").permitAll().requestMatchers("/swagger-ui/*").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/signin").permitAll().anyRequest().authenticated())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
				.addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}
