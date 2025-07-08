package com.budgetwise.backend.controllers;

import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.dto.SalaryDto;
import com.budgetwise.backend.services.SalaryService;
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
@RequestMapping("api/salaries")
public class SalaryController {

	private final SalaryService salaryService;

	public SalaryController(SalaryService salaryService) {
		this.salaryService = salaryService;
	}

	@GetMapping("")
	public ResponseEntity<List<SalaryDto>> getSalaries() {
		return this.salaryService.getUserSalaries();
	}

	@PostMapping("")
	public ResponseEntity<SalaryDto> createOrUpdateSalary(@RequestBody SalaryDto salaryDto) {
		return this.salaryService.createOrUpdateSalary(salaryDto);
	}

	@DeleteMapping("/{salaryId}")
	public ResponseEntity<MessageDto> deleteSalary(@PathVariable UUID salaryId) {
		return this.salaryService.deleteSalary(salaryId);
	}
}
