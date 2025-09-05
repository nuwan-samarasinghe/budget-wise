package com.budgetwise.backend.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.budgetwise.backend.common.AbstractBaseTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.web.csrf.CsrfToken;

@DisplayName("CsrfControllerTest Integration Tests")
class CsrfControllerTest extends AbstractBaseTest {

	@Test
	void testGetCsrf() throws Exception {
		CsrfToken mockToken = Mockito.mock(CsrfToken.class);

		mockMvc.perform(
				get("/api/csrf").requestAttr(CsrfToken.class.getName(), mockToken).requestAttr("_csrf", mockToken))
				.andExpect(status().isNoContent()).andExpect(header().string("Cache-Control", "no-store"))
				.andExpect(content().string(""));
	}
}
