package com.budgetwise.backend.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RepositoryManager {

	public final UserRepository user;

	public final BudgetRepository budget;

	public final CategoryRepository category;

	public final ExpenseRepository expense;

	public final SalaryRepository salary;

	public final SavingsRepository savings;

	@Autowired
	private RepositoryManager(UserRepository user, BudgetRepository budget, CategoryRepository category,
			ExpenseRepository expense, SalaryRepository salary, SavingsRepository savings) {
		this.user = user;
		this.budget = budget;
		this.category = category;
		this.expense = expense;
		this.salary = salary;
		this.savings = savings;
	}
}
