package com.budgetwise.backend.controllers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.budgetwise.backend.common.AbstractBaseTest;
import com.budgetwise.backend.dto.SavingDto;
import com.budgetwise.backend.models.Saving;
import jakarta.servlet.http.Cookie;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("SavingsControllerTest Integration Tests")
class SavingsControllerTest extends AbstractBaseTest {

	@Test
	void testGetSavings() throws Exception {
		Saving saving1 = this.factory.saving.createAndPersist();
		Saving saving2 = this.factory.saving.createAndPersist();
		saving1.setUser(this.permenentUser);
		saving2.setUser(this.permenentUser);
		this.repository.savings.saveAllAndFlush(List.of(saving1, saving2));
		this.mockMvc.perform(get("/api/savings").with(csrf()).cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2));
	}

	@Test
	void testCreateOrUpdateSaving() throws Exception {
		SavingDto inputSaving = new SavingDto();
		inputSaving.setAmount(new BigDecimal("7000"));
		inputSaving.setNote("March Saving");
		inputSaving.setRecurrent(Boolean.FALSE);
		inputSaving.setSavingMonth(YearMonth.from(LocalDate.of(2024, 3, 1)));
		this.mockMvc
				.perform(post("/api/savings").with(csrf()).cookie(new Cookie("USER_SESSSION", authenticate()))
						.contentType("application/json").content(objectMapper.writeValueAsString(inputSaving)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.amount").value(7000))
				.andExpect(jsonPath("$.note").value("March Saving"));
	}

	@Test
	void testDeleteSaving() throws Exception {
		Saving saving1 = this.factory.saving.createAndPersist();
		saving1.setUser(this.permenentUser);
		saving1.setRecurrent(Boolean.FALSE);
		this.repository.savings.saveAndFlush(saving1);
		this.mockMvc
				.perform(delete("/api/savings/{savingId}", saving1.getId()).with(csrf())
						.cookie(new Cookie("USER_SESSSION", authenticate())))
				.andExpect(status().isOk()).andExpect(jsonPath("$.message").value("Successfully deleted"));
	}
}
