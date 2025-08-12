package com.budgetwise.backend.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class DashboardDto {
	private List<MonthlyIncomeAndExpense> montlyIncomeAndExpenses = new ArrayList<>();
	private List<BudgetAndExpense> budgetAndExpense = new ArrayList<>();
	private List<ExpenseVsCategories> expenseCategories = new ArrayList<>();
	private List<TopExpense> topExpenses = new ArrayList<>();
	private List<RecurringSubscriptions> recurringSubscriptions = new ArrayList<>();
	private List<FixedVsVariableIncome> fixedVariableIncomes = new ArrayList<>();
}
