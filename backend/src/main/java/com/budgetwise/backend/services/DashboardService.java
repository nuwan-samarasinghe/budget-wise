package com.budgetwise.backend.services;

import com.budgetwise.backend.common.SecurityUtils;
import com.budgetwise.backend.dto.BudgetAndExpense;
import com.budgetwise.backend.dto.DashboardDto;
import com.budgetwise.backend.dto.ExpenseVsCategories;
import com.budgetwise.backend.dto.MonthlyIncomeAndExpense;
import com.budgetwise.backend.dto.TopExpense;
import com.budgetwise.backend.models.Category;
import com.budgetwise.backend.models.Expense;
import com.budgetwise.backend.models.User;
import com.budgetwise.backend.repositories.RepositoryManager;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

	private final RepositoryManager interfaces;
	private final ModelMapper mapper;
	private final SecurityUtils securityUtil;

	public DashboardService(RepositoryManager interfaces, SecurityUtils securityUtil) {
		this.interfaces = interfaces;
		this.securityUtil = securityUtil;
		this.mapper = new ModelMapper();
	}

	public ResponseEntity<DashboardDto> getDashboardDetails() {

		User user = this.securityUtil.getCurrentUser();
		Map<YearMonth, MonthlyIncomeAndExpense> monthlyMap = new HashMap<>();
		Map<Category, ExpenseVsCategories> yearlyCategoryMap = new HashMap<>();

		// Aggregate salaries (income)
		user.getSalaries().forEach(salary -> {
			YearMonth ym = YearMonth.of(salary.getIncomeMonth().getYear(), salary.getIncomeMonth().getMonth());
			monthlyMap.computeIfAbsent(ym, k -> {
				MonthlyIncomeAndExpense mie = new MonthlyIncomeAndExpense();
				mie.setYear(k.getYear());
				mie.setMonth(k.getMonth().name());
				return mie;
			}).setIncome(monthlyMap.get(ym).getIncome() + salary.getAmount().doubleValue());
		});

		BudgetAndExpense budgetAndExpense1 = new BudgetAndExpense();
		budgetAndExpense1.setName("Budget");
		budgetAndExpense1.setValue(0);
		user.getBudgets().forEach(b -> {
			if (b.getCreatedAt().getYear() == LocalDate.now().getYear()) {
				budgetAndExpense1.setValue(budgetAndExpense1.getValue() + b.getAmount().doubleValue());
			}
		});

		BudgetAndExpense budgetAndExpense2 = new BudgetAndExpense();
		budgetAndExpense2.setName("Spent");
		budgetAndExpense2.setValue(0);
		// Aggregate expenses
		user.getExpenses().forEach(expense -> {
			if (expense.getCreatedAt().getYear() == LocalDate.now().getYear()) {
				YearMonth ym = YearMonth.of(expense.getCreatedAt().getYear(), expense.getCreatedAt().getMonth());
				monthlyMap.computeIfAbsent(ym, k -> {
					MonthlyIncomeAndExpense mie = new MonthlyIncomeAndExpense();
					mie.setYear(k.getYear());
					mie.setMonth(k.getMonth().name());
					return mie;
				}).setExpense(monthlyMap.get(ym).getExpense() + expense.getAmount().doubleValue());
				budgetAndExpense2.setValue(budgetAndExpense2.getValue() + expense.getAmount().doubleValue());
				yearlyCategoryMap.computeIfAbsent(expense.getCategory(), category -> {
					ExpenseVsCategories newEntry = new ExpenseVsCategories();
					newEntry.setCategory(category.getName());
					newEntry.setValue(0.0);
					return newEntry;
				}).setValue(
						yearlyCategoryMap.get(expense.getCategory()).getValue() + expense.getAmount().doubleValue());
			}
		});

		List<TopExpense> top5Expenses = user.getExpenses().stream()
				.sorted(Comparator.comparing(Expense::getAmount).reversed()).limit(5).map(expense -> {
					TopExpense top = new TopExpense();
					top.setCategory(expense.getCategory().getName());
					top.setValue(expense.getAmount().doubleValue());
					return top;
				}).collect(Collectors.toList());

		// Prepare the response DTO
		DashboardDto dashboard = new DashboardDto();
		dashboard.getMontlyIncomeAndExpenses().addAll(monthlyMap.values());
		dashboard.getBudgetAndExpense().add(budgetAndExpense1);
		dashboard.getBudgetAndExpense().add(budgetAndExpense2);
		dashboard.getExpenseCategories().addAll(yearlyCategoryMap.values());
		dashboard.getTopExpenses().addAll(top5Expenses);

		return ResponseEntity.ok(dashboard);
	}
}
