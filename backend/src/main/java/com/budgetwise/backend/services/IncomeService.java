package com.budgetwise.backend.services;

import com.budgetwise.backend.common.BudgetWiseException;
import com.budgetwise.backend.common.SecurityUtils;
import com.budgetwise.backend.dto.IncomeDto;
import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.models.Income;
import com.budgetwise.backend.models.User;
import com.budgetwise.backend.repositories.RepositoryManager;
import java.util.List;
import java.util.UUID;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IncomeService {

	private final RepositoryManager interfaces;
	private final ModelMapper mapper;
	private final SecurityUtils securityUtil;

	public IncomeService(RepositoryManager interfaces, SecurityUtils securityUtil) {
		this.interfaces = interfaces;
		this.securityUtil = securityUtil;
		this.mapper = new ModelMapper();
	}

	public ResponseEntity<List<IncomeDto>> getUserIncomes() {
		return ResponseEntity.ok(this.interfaces.income.findByUser(this.securityUtil.getCurrentUser()).stream()
				.map(income -> this.mapper.map(income, IncomeDto.class)).toList());
	}

	@Transactional
	public ResponseEntity<IncomeDto> createOrUpdateIncome(IncomeDto incomeDto) {
		Income mappedSalary = this.mapper.map(incomeDto, Income.class);
		mappedSalary.setUser(this.securityUtil.getCurrentUser());
		Income saved = this.interfaces.income.saveAndFlush(mappedSalary);
		return ResponseEntity.ok(this.mapper.map(saved, IncomeDto.class));
	}

	@Transactional
	public ResponseEntity<MessageDto> deleteIncome(UUID incomeId) {
		User user = this.securityUtil.getCurrentUser();
		Income income = this.interfaces.income.findById(incomeId)
				.orElseThrow(() -> new BudgetWiseException("Given income is not available"));
		if (income.getUser().getId().equals(user.getId())) {
			this.interfaces.income.delete(income);
			return ResponseEntity.ok(new MessageDto(HttpStatus.OK.value(), "Successfully deleted"));
		} else {
			throw new AccessDeniedException("User does not have access.");
		}
	}
}
