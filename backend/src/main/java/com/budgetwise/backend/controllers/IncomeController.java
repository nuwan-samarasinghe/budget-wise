package com.budgetwise.backend.controllers;

import com.budgetwise.backend.dto.IncomeDto;
import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.services.IncomeService;
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
@RequestMapping("api/incomes")
public class IncomeController {

	private final IncomeService incomeService;

	public IncomeController(IncomeService salaryService) {
		this.incomeService = salaryService;
	}

	@GetMapping("")
	public ResponseEntity<List<IncomeDto>> getSalaries() {
		return this.incomeService.getUserIncomes();
	}

	@PostMapping("")
	public ResponseEntity<IncomeDto> createOrUpdateSalary(@RequestBody IncomeDto incomeDto) {
		return this.incomeService.createOrUpdateIncome(incomeDto);
	}

	@DeleteMapping("/{incomeId}")
	public ResponseEntity<MessageDto> deleteSalary(@PathVariable UUID incomeId) {
		return this.incomeService.deleteIncome(incomeId);
	}
}
