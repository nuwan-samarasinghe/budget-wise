package com.budgetwise.backend.services;

import com.budgetwise.backend.common.BudgetWiseException;
import com.budgetwise.backend.common.SecurityUtils;
import com.budgetwise.backend.dto.BudgetDto;
import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.models.Budget;
import com.budgetwise.backend.models.Expense;
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
public class BudgetService {

	private final RepositoryManager interfaces;
	private final ModelMapper mapper;
	private final SecurityUtils securityUtil;

	public BudgetService(RepositoryManager interfaces, SecurityUtils securityUtil) {
		this.interfaces = interfaces;
		this.securityUtil = securityUtil;
		this.mapper = new ModelMapper();
	}

	public ResponseEntity<List<BudgetDto>> getUserBudgets() {
		return ResponseEntity.ok(this.interfaces.budget.findByUser(this.securityUtil.getCurrentUser()).stream()
				.map(budget -> this.mapper.map(budget, BudgetDto.class)).toList());
	}

	@Transactional
	public ResponseEntity<BudgetDto> createOrUpdateBudget(BudgetDto dto) {
		Budget mappedBudget = this.mapper.map(dto, Budget.class);
		mappedBudget.setUser(this.securityUtil.getCurrentUser());
		Budget saved = this.interfaces.budget.saveAndFlush(mappedBudget);
		return ResponseEntity.ok(this.mapper.map(saved, BudgetDto.class));
	}

	@Transactional
	public ResponseEntity<MessageDto> deleteBudget(UUID budgetId) {
		User user = this.securityUtil.getCurrentUser();
		Budget budget = this.interfaces.budget.findById(budgetId)
				.orElseThrow(() -> new BudgetWiseException("Given budget is not available"));
		if (budget.getUser().getId().equals(user.getId())) {
			this.interfaces.budget.delete(budget);
			return ResponseEntity.ok(new MessageDto(HttpStatus.OK.value(), "Successfully deleted"));
		} else {
			throw new AccessDeniedException("User does not have access.");
		}
	}

	@Transactional
	public ResponseEntity<MessageDto> transferBudgetToExpense(UUID budgetId) {
		User user = this.securityUtil.getCurrentUser();
		Budget budget = this.interfaces.budget.findById(budgetId)
				.orElseThrow(() -> new BudgetWiseException("Given budget is not available"));
		if (budget.getUser().getId().equals(user.getId())) {
			Expense mappedExpense = this.mapper.map(budget, Expense.class);
			mappedExpense.setId(null);
			mappedExpense.setUser(user);
			this.interfaces.expense.saveAndFlush(mappedExpense);
			return ResponseEntity.ok(new MessageDto(HttpStatus.OK.value(), "Successfully transfered"));
		} else {
			throw new AccessDeniedException("User does not have access.");
		}
	}
}
