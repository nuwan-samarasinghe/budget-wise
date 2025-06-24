package com.budgetwise.backend.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import com.budgetwise.backend.common.AbstractBaseTest;
import com.budgetwise.backend.models.User;
import jakarta.transaction.Transactional;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class UserRepositoryTest extends AbstractBaseTest {

	@Autowired
	private UserRepository userRepository;

	@Transactional
	@Test
	public void testAddNewUser() {
		User user = new User();
		user.setEmail("test@example.com");
		user.setPassword("password");
		user.setUserName("testuser");
		user.setActive(true);

		User saved_user = this.userRepository.saveAndFlush(user);

		Optional<User> found = userRepository.findById(saved_user.getId());
		assertThat(found).isPresent();
		assertThat(found.get().getEmail()).isEqualTo("test@example.com");
	}
}
