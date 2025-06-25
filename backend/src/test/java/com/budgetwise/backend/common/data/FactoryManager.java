package com.budgetwise.backend.common.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FactoryManager {

	public final UserFactory user;

	@Autowired
	public FactoryManager(UserFactory userFactory) {
		this.user = userFactory;
	}
}
