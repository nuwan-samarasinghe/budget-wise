package com.budgetwise.backend.controllers;

import com.budgetwise.backend.dto.BudgetDto;
import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.dto.MontlyAndYearlySummaryDtos;
import com.budgetwise.backend.services.BudgetService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/budgets")
public class BudgetController {

	private final BudgetService budgetService;

	public BudgetController(BudgetService budgetService) {
		this.budgetService = budgetService;
	}

	@GetMapping("")
	public ResponseEntity<List<BudgetDto>> getBudgets() {
		return this.budgetService.getUserBudgets();
	}

	@PostMapping("")
	public ResponseEntity<BudgetDto> createOrUpdateBudget(@RequestBody BudgetDto budgetDto) {
		return this.budgetService.createOrUpdateBudget(budgetDto);
	}

	@GetMapping("/summary")
	public ResponseEntity<MontlyAndYearlySummaryDtos> getBudgetSummary() {
		return this.budgetService.getBudgetSummary();
	}

	@DeleteMapping("/{budgetId}")
	public ResponseEntity<MessageDto> deleteSalary(@PathVariable UUID budgetId) {
		return this.budgetService.deleteBudget(budgetId);
	}

	@PostMapping("/{budgetId}/transfer")
	public ResponseEntity<MessageDto> tansferBudgetToExpense(@PathVariable UUID budgetId) {
		return this.budgetService.transferBudgetToExpense(budgetId);
	}
}
