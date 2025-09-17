package com.budgetwise.backend.controllers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.budgetwise.backend.common.AbstractBaseTest;
import com.budgetwise.backend.models.Budget;
import com.budgetwise.backend.models.Income;
import jakarta.servlet.http.Cookie;
import java.time.YearMonth;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("SavingsControllerTest Integration Tests")
public class DashboardControllerTest extends AbstractBaseTest {

	@Test
	void testGetDashboard() throws Exception {
		Income income1 = this.factory.income.createAndPersist();
		income1.setIncomeMonth(YearMonth.of(YearMonth.now().getYear(), 1));
		Income income2 = this.factory.income.createAndPersist();
		income2.setIncomeMonth(YearMonth.of(YearMonth.now().getYear(), 2));
		Income income3 = this.factory.income.createAndPersist();
		income3.setIncomeMonth(YearMonth.of(YearMonth.now().getYear(), 3));
		Income income4 = this.factory.income.createAndPersist();
		income4.setIncomeMonth(YearMonth.of(YearMonth.now().getYear(), 4));
		income1.setUser(this.getTestUser());
		income2.setUser(this.getTestUser());
		income3.setUser(this.getTestUser());
		income4.setUser(this.getTestUser());
		this.repository.income.saveAllAndFlush(List.of(income1, income2, income3, income4));

		Budget budget1 = this.factory.budget.createAndPersist();
		budget1.setBudgetMonth(YearMonth.of(YearMonth.now().getYear(), 1));
		Budget budget2 = this.factory.budget.createAndPersist();
		budget2.setBudgetMonth(YearMonth.of(YearMonth.now().getYear(), 2));
		Budget budget3 = this.factory.budget.createAndPersist();
		budget3.setBudgetMonth(YearMonth.of(YearMonth.now().getYear(), 3));
		Budget budget4 = this.factory.budget.createAndPersist();
		budget4.setBudgetMonth(YearMonth.of(YearMonth.now().getYear(), 4));
		budget1.setUser(this.getTestUser());
		budget2.setUser(this.getTestUser());
		budget3.setUser(this.getTestUser());
		budget4.setUser(this.getTestUser());
		this.repository.budget.saveAllAndFlush(List.of(budget1, budget2, budget3, budget4));

		this.mockMvc.perform(get("/api/dashboard").with(csrf()).cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(6));
	}
}
