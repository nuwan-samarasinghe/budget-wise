package com.budgetwise.backend.common.data;

import com.budgetwise.backend.models.User;
import com.budgetwise.backend.repositories.UserRepository;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class UserFactory extends AbstractFactory<User> {

	protected UserFactory(UserRepository repository) {
		super(repository);
	}

	@Override
	protected User build() {
		User user = new User();
		user.setFullName(faker.name().fullName());
		user.setActive(true);
		user.setPassword(faker.pokemon().name());
		user.setUsername(faker.name().firstName().toLowerCase() + UUID.randomUUID().toString());
		return user;
	}
}
