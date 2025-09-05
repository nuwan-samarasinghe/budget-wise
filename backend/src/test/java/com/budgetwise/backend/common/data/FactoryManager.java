package com.budgetwise.backend.common.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FactoryManager {

	public final UserFactory user;

	public final IncomeFactory income;

	public final SavingFactory saving;

	public final BudgetFactory budget;

	@Autowired
	public FactoryManager(UserFactory userFactory, IncomeFactory salary, SavingFactory saving, BudgetFactory budget) {
		this.user = userFactory;
		this.income = salary;
		this.saving = saving;
		this.budget = budget;
	}
}
