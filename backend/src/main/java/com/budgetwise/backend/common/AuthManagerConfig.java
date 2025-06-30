package com.budgetwise.backend.common;

import com.budgetwise.backend.services.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AuthManagerConfig {

	private final UserService userService;
	private final PasswordEncoder passwordEncorder;

	public AuthManagerConfig(UserService userService, PasswordEncoder passwordEncorder) {
		this.userService = userService;
		this.passwordEncorder = passwordEncorder;
	}

	@Bean
	public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
		AuthenticationManagerBuilder authenticationManagerBuilder = http
				.getSharedObject(AuthenticationManagerBuilder.class);
		authenticationManagerBuilder.userDetailsService(this.userService).passwordEncoder(this.passwordEncorder);
		return authenticationManagerBuilder.build();
	}
}
