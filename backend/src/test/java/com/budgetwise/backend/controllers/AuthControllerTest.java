package com.budgetwise.backend.controllers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.budgetwise.backend.common.AbstractBaseTest;
import com.budgetwise.backend.dto.AuthDto;
import com.budgetwise.backend.models.User;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

@DisplayName("AuthControllerTest Integration Tests")
class AuthControllerTest extends AbstractBaseTest {

	@Test
	void testSignIn_success() throws Exception {
		AuthDto authDto = new AuthDto("auth-test1@gmail.com", "test123@");
		ResultActions result = this.mockMvc.perform(post("/api/auth/signin").with(csrf())
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(authDto)));
		result.andExpect(status().is2xxSuccessful()).andExpect(jsonPath("$.message").exists());
	}

	@Test
	void testLogin_setsJwtCookie() throws Exception {
		String password = "test123@";
		User user = new User();
		user.setPassword(passwordEn.encode(password));
		user.setUsername("auth-test2@gmail.com");
		this.repository.user.saveAndFlush(user);

		AuthDto authDto = new AuthDto(user.getUsername(), password);

		ResultActions result = this.mockMvc.perform(post("/api/auth/login").with(csrf())
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(authDto)));

		result.andExpect(status().isOk()).andExpect(cookie().exists("USER_SESSSION"))
				.andExpect(cookie().httpOnly("USER_SESSSION", true));
	}

	@Test
	void testLogin_invalidCredentials_shouldFail() throws Exception {
		AuthDto invalidDto = new AuthDto("wronguser@gmail.com", "wrongpass");

		this.mockMvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(invalidDto))).andExpect(status().isForbidden());
	}

	@Test
	void testLogout_clearsJwtCookie() throws Exception {
		String password = "test123@";
		User user = new User();
		user.setPassword(passwordEn.encode(password));
		user.setUsername("auth-test4@gmail.com");
		this.repository.user.saveAndFlush(user);

		AuthDto authDto = new AuthDto(user.getUsername(), password);

		String jwtCookie = this.mockMvc
				.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(authDto)))
				.andExpect(status().isOk()).andExpect(cookie().exists("USER_SESSSION")).andReturn().getResponse()
				.getCookie("USER_SESSSION").getValue();

		ResultActions result2 = this.mockMvc
				.perform(post("/api/auth/logout").with(csrf()).cookie(new Cookie("USER_SESSSION", jwtCookie)));

		result2.andExpect(status().isOk()).andExpect(cookie().value("USER_SESSSION", ""))
				.andExpect(cookie().maxAge("USER_SESSSION", 0));
	}
}
