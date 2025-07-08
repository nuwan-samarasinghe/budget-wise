package com.budgetwise.backend.common;

import com.budgetwise.backend.models.User;
import com.budgetwise.backend.repositories.RepositoryManager;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@TestConfiguration
public class TestDataConfiguration {

	@Bean
	public User permanentTestUser(RepositoryManager repository, PasswordEncoder passwordEn) {
		User user = new User();
		user.setUsername("auth-permanent@gmail.com");
		user.setPassword(passwordEn.encode("test123@"));
		return repository.user.saveAndFlush(user);
	}
}
