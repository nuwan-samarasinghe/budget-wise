package com.budgetwise.backend.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import com.budgetwise.backend.common.AbstractBaseTest;
import com.budgetwise.backend.common.data.FactoryManager;
import com.budgetwise.backend.models.User;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@DisplayName("UserRepository Integration Tests")
public class UserRepositoryTest extends AbstractBaseTest {

	@Autowired
	private FactoryManager factory;

	@Autowired
	private RepositoryManager repository;

	@Test
	@DisplayName("Should persist and retrieve a new user")
	public void testAddNewUser() {
		User saved_user = this.factory.user.createAndPersist();
		Optional<User> userOptional = this.repository.user.findById(saved_user.getId());
		assertThat(userOptional).isPresent();
		assertThat(userOptional.get().getEmail()).isEqualTo(saved_user.getEmail());
	}

	@Test
	@DisplayName("Should return empty when user ID does not exist")
	public void testFindUserById_notFound() {
		Optional<User> userOptional = this.repository.user.findById(UUID.randomUUID());
		assertThat(userOptional).isNotPresent();
	}

	@Test
	@DisplayName("Should find user by email")
	public void testFindByEmail() {
		User saved_user = this.factory.user.createAndPersist();
		Optional<User> foundUser = this.repository.user.findByEmail(saved_user.getEmail());
		assertThat(foundUser).isPresent();
		assertThat(foundUser.get().getId()).isEqualTo(saved_user.getId());
	}
}
