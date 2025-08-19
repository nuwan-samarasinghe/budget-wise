package com.budgetwise.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CsrfController {

	@GetMapping("/csrf")
	public ResponseEntity<Void> csrf(CsrfToken token) {
		// Touching the CsrfToken ensures the XSRF-TOKEN cookie is created/updated
		return ResponseEntity.noContent().header("Cache-Control", "no-store").build();
	}
}
