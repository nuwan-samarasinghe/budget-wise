package com.budgetwise.backend.common.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FactoryManager {

	public final UserFactory user;

	public final SalaryFactory salary;

	public final SavingFactory saving;

	public final BudgetFactory budget;

	@Autowired
	public FactoryManager(UserFactory userFactory, SalaryFactory salary, SavingFactory saving, BudgetFactory budget) {
		this.user = userFactory;
		this.salary = salary;
		this.saving = saving;
		this.budget = budget;
	}
}
