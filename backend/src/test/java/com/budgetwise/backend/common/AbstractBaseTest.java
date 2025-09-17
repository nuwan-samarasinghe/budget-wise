package com.budgetwise.backend.common;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.budgetwise.backend.common.data.FactoryManager;
import com.budgetwise.backend.dto.AuthDto;
import com.budgetwise.backend.models.User;
import com.budgetwise.backend.repositories.RepositoryManager;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(classes = TestDataConfiguration.class)
@AutoConfigureMockMvc
@TestInstance(Lifecycle.PER_METHOD)
public abstract class AbstractBaseTest extends AbstractContainerTest {

	public static String password = "test123@";
	@Autowired
	public MockMvc mockMvc;

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

	private User testUser;

	public User getTestUser() {
		return testUser;
	}

	@BeforeEach
	protected void setUpUser() {
		User user = new User();
		user.setUsername("testuser_" + System.currentTimeMillis() + "@gmail.com");
		user.setPassword(passwordEn.encode(password));
		this.testUser = repository.user.saveAndFlush(user);
	}

	protected String authenticate() throws Exception {
		AuthDto authDto = new AuthDto(this.testUser.getUsername(), password);
		return this.mockMvc
				.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(authDto)))
				.andExpect(status().isOk()).andExpect(cookie().exists("USER_SESSSION")).andReturn().getResponse()
				.getCookie("USER_SESSSION").getValue();
	}
}
