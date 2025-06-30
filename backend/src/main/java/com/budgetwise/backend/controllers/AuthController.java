package com.budgetwise.backend.controllers;

import com.budgetwise.backend.dto.AuthDto;
import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.services.ServiceManager;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthController {

	private final ServiceManager service;
	private final AuthenticationManager auth;

	public AuthController(ServiceManager service, AuthenticationManager auth) {
		this.service = service;
		this.auth = auth;
	}

	@PostMapping("/signin")
	public ResponseEntity<MessageDto> signIn(@RequestBody @Valid AuthDto auth) {
		return this.service.user.cereateUser(auth);
	}

	@PostMapping("/login")
	public ResponseEntity<MessageDto> logIn(@RequestBody @Valid AuthDto authDto, HttpServletResponse response) {
		Authentication authentication = auth
				.authenticate(new UsernamePasswordAuthenticationToken(authDto.getUsername(), authDto.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		return this.service.user.loginUser(authentication, response);
	}

	@PostMapping("/logout")
	public ResponseEntity<MessageDto> logIn(HttpServletResponse response) {
		return this.service.user.logOut(response);
	}
}
