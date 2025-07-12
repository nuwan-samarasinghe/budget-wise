package com.budgetwise.backend.controllers;

import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.dto.SavingDto;
import com.budgetwise.backend.services.SavingsService;
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
@RequestMapping("api/savings")
public class SavingsController {

	private final SavingsService savingsService;

	public SavingsController(SavingsService savingsService) {
		this.savingsService = savingsService;
	}

	@GetMapping("")
	public ResponseEntity<List<SavingDto>> getAllSavings() {
		return savingsService.getAllSavings();
	}

	@PostMapping("")
	public ResponseEntity<SavingDto> createOrUpdateSavings(@RequestBody SavingDto dto) {
		return savingsService.createOrUpdateSavings(dto);
	}

	@DeleteMapping("/{savingId}")
	public ResponseEntity<MessageDto> deleteSavings(@PathVariable UUID savingId) {
		return this.savingsService.deleteSavings(savingId);
	}
}
