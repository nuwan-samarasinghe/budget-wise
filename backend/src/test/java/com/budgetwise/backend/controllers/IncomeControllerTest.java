package com.budgetwise.backend.controllers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.budgetwise.backend.common.AbstractBaseTest;
import com.budgetwise.backend.dto.IncomeDto;
import com.budgetwise.backend.models.Income;

import jakarta.servlet.http.Cookie;

@DisplayName("IncomeControllerTest Integration Tests")
class IncomeControllerTest extends AbstractBaseTest {

	@Test
	void testGetIncomes() throws Exception {
		Income income1 = this.factory.income.createAndPersist();
		Income income2 = this.factory.income.createAndPersist();
		income1.setUser(this.permenentUser);
		income2.setUser(this.permenentUser);
		this.repository.income.saveAllAndFlush(List.of(income1, income2));
		this.mockMvc.perform(get("/api/incomes").with(csrf()).cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(6));
	}

	@Test
	void testCreateOrUpdateIncome() throws Exception {
		IncomeDto inputIncome = new IncomeDto();
		inputIncome.setAmount(new BigDecimal("7000"));
		inputIncome.setIncomeMonth(YearMonth.from(LocalDate.of(2024, 3, 1)));
		inputIncome.setSource("Company XYZ");
		inputIncome.setNote("March Salary");
		inputIncome.setRecurrent(Boolean.FALSE);
		this.mockMvc
				.perform(post("/api/incomes").with(csrf()).cookie(new Cookie("USER_SESSSION", authenticate()))
						.contentType("application/json").content(objectMapper.writeValueAsString(inputIncome)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.amount").value(7000))
				.andExpect(jsonPath("$.note").value("March Salary"));
	}

	@Test
	void testDeleteIncome() throws Exception {
		Income income1 = this.factory.income.createAndPersist();
		income1.setUser(this.permenentUser);
		income1.setRecurrent(Boolean.FALSE);
		this.repository.income.saveAndFlush(income1);
		this.mockMvc
				.perform(delete("/api/incomes/{incomeId}", income1.getId()).with(csrf())
						.cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.message").value("Successfully deleted"));
	}

	@Test
	void testGetSummary() throws Exception {
		Income income1 = this.factory.income.createAndPersist();
		income1.setIncomeMonth(YearMonth.of(YearMonth.now().getYear(), 1));
		Income income2 = this.factory.income.createAndPersist();
		income2.setIncomeMonth(YearMonth.of(YearMonth.now().getYear(), 2));
		Income income3 = this.factory.income.createAndPersist();
		income3.setIncomeMonth(YearMonth.of(YearMonth.now().getYear(), 3));
		Income income4 = this.factory.income.createAndPersist();
		income4.setIncomeMonth(YearMonth.of(YearMonth.now().getYear(), 4));
		income1.setUser(this.permenentUser);
		income2.setUser(this.permenentUser);
		income3.setUser(this.permenentUser);
		income4.setUser(this.permenentUser);
		this.repository.income.saveAllAndFlush(List.of(income1, income2, income3, income4));
		this.mockMvc
				.perform(get("/api/incomes/summary").with(csrf()).cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.monthSummary").exists())
				.andExpect(jsonPath("$.yearSummary").exists()).andExpect(jsonPath("$.monthSummary").exists());
	}
}
