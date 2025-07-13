package com.budgetwise.backend.controllers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.budgetwise.backend.common.AbstractBaseTest;
import com.budgetwise.backend.dto.BudgetDto;
import com.budgetwise.backend.models.Budget;
import jakarta.servlet.http.Cookie;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("BudgetControllerTest Integration Tests")
class BudgetControllerTest extends AbstractBaseTest {

	@Test
	void testGGetUserBudgets() throws Exception {
		Budget budget1 = this.factory.budget.createAndPersist();
		Budget budget2 = this.factory.budget.createAndPersist();
		budget1.setUser(this.permenentUser);
		budget2.setUser(this.permenentUser);
		this.repository.budget.saveAllAndFlush(List.of(budget1, budget2));
		this.mockMvc.perform(get("/api/budgets").with(csrf()).cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2));
	}

	@Test
	void testCreateOrUpdateBudget() throws Exception {
		BudgetDto inputBudget = new BudgetDto();
		inputBudget.setAmount(new BigDecimal("7000"));
		inputBudget.setSource("Company XYZ");
		inputBudget.setNote("Bill payment");
		this.mockMvc
				.perform(post("/api/budgets").with(csrf()).cookie(new Cookie("USER_SESSSION", authenticate()))
						.contentType("application/json").content(objectMapper.writeValueAsString(inputBudget)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.amount").value(7000))
				.andExpect(jsonPath("$.note").value("Bill payment"));
	}

	@Test
	void testDeleteSalary() throws Exception {
		Budget budget1 = this.factory.budget.createAndPersist();
		budget1.setUser(this.permenentUser);
		this.repository.budget.saveAndFlush(budget1);
		this.mockMvc
				.perform(delete("/api/budgets/{budgetId}", budget1.getId()).with(csrf())
						.cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.message").value("Successfully deleted"));
	}

	@Test
	void testtransferBudgetToExpense() throws Exception {
		Budget budget1 = this.factory.budget.createAndPersist();
		budget1.setUser(this.permenentUser);
		this.repository.budget.saveAndFlush(budget1);
		this.mockMvc
				.perform(post("/api/budgets/{budgetId}/transfer", budget1.getId()).with(csrf())
						.cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.message").value("Successfully transfered"));
	}
}
