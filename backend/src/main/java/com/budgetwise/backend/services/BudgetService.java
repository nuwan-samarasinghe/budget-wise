package com.budgetwise.backend.services;

import com.budgetwise.backend.common.BudgetWiseException;
import com.budgetwise.backend.common.CommonUtil;
import com.budgetwise.backend.common.SecurityUtils;
import com.budgetwise.backend.dto.BudgetDto;
import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.dto.MontlyAndYearlySummaryDto;
import com.budgetwise.backend.dto.MontlyAndYearlySummaryDtos;
import com.budgetwise.backend.models.Budget;
import com.budgetwise.backend.models.Expense;
import com.budgetwise.backend.models.User;
import com.budgetwise.backend.repositories.RepositoryManager;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
		return ResponseEntity
				.ok(this.interfaces.budget.findByUserOrderByBudgetMonthAsc(this.securityUtil.getCurrentUser()).stream()
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

	public ResponseEntity<MontlyAndYearlySummaryDtos> getBudgetSummary() {
		MontlyAndYearlySummaryDtos montlyAndYearlySummaryDtos = new MontlyAndYearlySummaryDtos();
		User user = this.securityUtil.getCurrentUser();
		List<Budget> budgets = this.interfaces.budget.findByUserOrderByBudgetMonthAsc(user);
		Map<String, MontlyAndYearlySummaryDto> yearMap = new HashMap<>();
		Map<String, MontlyAndYearlySummaryDto> monthMap = new HashMap<>();
		String currentYear = "" + YearMonth.now().getYear();

		budgets.forEach(budget -> {
			MontlyAndYearlySummaryDto monthData = monthMap.get(budget.getBudgetMonth().getMonth().name());
			if (currentYear.equals("" + budget.getBudgetMonth().getYear())) {
				if (monthData == null) {
					MontlyAndYearlySummaryDto newMonthData = new MontlyAndYearlySummaryDto();
					newMonthData.setAmount(budget.getAmount());
					newMonthData.setMonth(budget.getBudgetMonth().getMonth().name());
					monthMap.put(budget.getBudgetMonth().getMonth().name(), newMonthData);
				} else {
					monthData.setAmount(monthData.getAmount().add(budget.getAmount()));
				}
			}

			MontlyAndYearlySummaryDto yearData = yearMap.get("" + budget.getBudgetMonth().getYear());
			if (yearData == null) {
				MontlyAndYearlySummaryDto newYearData = new MontlyAndYearlySummaryDto();
				newYearData.setAmount(budget.getAmount());
				newYearData.setYear("" + budget.getBudgetMonth().getYear());
				yearMap.put("" + budget.getBudgetMonth().getYear(), newYearData);
			} else {
				yearData.setAmount(yearData.getAmount().add(budget.getAmount()));
			}
		});

		montlyAndYearlySummaryDtos.getMonthSummary().addAll(monthMap.values().stream()
				.sorted(Comparator.comparingInt(d -> CommonUtil.toMonthNumber(d.getMonth()))).toList());

		montlyAndYearlySummaryDtos.getYearSummary().addAll(
				yearMap.values().stream().sorted(Comparator.comparingInt(d -> Integer.parseInt(d.getYear()))).toList());

		return ResponseEntity.ok(montlyAndYearlySummaryDtos);
	}
}
