package com.budgetwise.backend.controllers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.budgetwise.backend.common.AbstractBaseTest;
import com.budgetwise.backend.dto.SalaryDto;
import com.budgetwise.backend.models.Salary;
import jakarta.servlet.http.Cookie;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("SalaryControllerTest Integration Tests")
class SalaryControllerTest extends AbstractBaseTest {

	@Test
	void testGetSalaries() throws Exception {
		Salary salary1 = this.factory.salary.createAndPersist();
		Salary salary2 = this.factory.salary.createAndPersist();
		salary1.setUser(this.permenentUser);
		salary2.setUser(this.permenentUser);
		this.repository.salary.saveAllAndFlush(List.of(salary1, salary2));
		this.mockMvc.perform(get("/api/salaries").with(csrf()).cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2));
	}

	@Test
	void testCreateOrUpdateSalary() throws Exception {
		SalaryDto inputSalary = new SalaryDto();
		inputSalary.setAmount(new BigDecimal("7000"));
		inputSalary.setSalaryMonth(LocalDate.of(2024, 3, 1));
		inputSalary.setSource("Company XYZ");
		inputSalary.setNote("March Salary");
		this.mockMvc
				.perform(post("/api/salaries").with(csrf()).cookie(new Cookie("USER_SESSSION", authenticate()))
						.contentType("application/json").content(objectMapper.writeValueAsString(inputSalary)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.amount").value(7000))
				.andExpect(jsonPath("$.note").value("March Salary"));
	}

	@Test
	void testDeleteSalary() throws Exception {
		Salary salary1 = this.factory.salary.createAndPersist();
		salary1.setUser(this.permenentUser);
		this.repository.salary.saveAndFlush(salary1);
		this.mockMvc
				.perform(delete("/api/salaries/{salaryId}", salary1.getId()).with(csrf())
						.cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.message").value("Successfully deleted"));
	}
}
