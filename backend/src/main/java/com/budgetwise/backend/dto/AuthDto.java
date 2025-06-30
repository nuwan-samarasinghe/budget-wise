package com.budgetwise.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthDto {
	@NotBlank(message = "Username is required")
	@Email(message = "Email should be valid")
	private String username;

	@NotBlank(message = "Password is required")
	private String password;
}
