package com.budgetwise.backend.repositories;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RepositoryManager {
	public final UserRepository user;
	public final BudgetRepository budget;
	public final CategoryRepository category;
	public final ExpenseRepository expense;
	public final SalaryRepository salary;
	public final SavingsRepository savings;
}
