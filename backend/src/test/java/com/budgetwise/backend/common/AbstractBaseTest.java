package com.budgetwise.backend.common;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.budgetwise.backend.common.data.FactoryManager;
import com.budgetwise.backend.dto.AuthDto;
import com.budgetwise.backend.models.User;
import com.budgetwise.backend.repositories.RepositoryManager;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(classes = TestDataConfiguration.class)
@AutoConfigureMockMvc
public abstract class AbstractBaseTest extends AbstractContainerTest {

	@Autowired
	public MockMvc mockMvc;
	public static String password = "test123@";

	@Autowired
	public ObjectMapper objectMapper;

	@Autowired
	public FactoryManager factory;

	@Autowired
	public RepositoryManager repository;

	@Autowired
	public PasswordEncoder passwordEn;

	@Autowired
	public User permenentUser;

	protected String authenticate() throws Exception {
		AuthDto authDto = new AuthDto(this.permenentUser.getUsername(), password);
		return this.mockMvc
				.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(authDto)))
				.andExpect(status().isOk()).andExpect(cookie().exists("USER_SESSSION")).andReturn().getResponse()
				.getCookie("USER_SESSSION").getValue();
	}
}
