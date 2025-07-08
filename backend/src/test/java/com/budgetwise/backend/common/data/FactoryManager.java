package com.budgetwise.backend.common.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FactoryManager {

	public final UserFactory user;

	public final SalaryFactory salary;

	@Autowired
	public FactoryManager(UserFactory userFactory, SalaryFactory salary) {
		this.user = userFactory;
		this.salary = salary;
	}
}
