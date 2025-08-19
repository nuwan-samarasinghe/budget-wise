package com.budgetwise.backend.services;

import java.time.Month;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.budgetwise.backend.common.BudgetWiseException;
import com.budgetwise.backend.common.SecurityUtils;
import com.budgetwise.backend.dto.IncomeDto;
import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.dto.MontlyAndYearlySummaryDto;
import com.budgetwise.backend.dto.MontlyAndYearlySummaryDtos;
import com.budgetwise.backend.models.Income;
import com.budgetwise.backend.models.User;
import com.budgetwise.backend.repositories.RepositoryManager;

@Service
public class IncomeService {

	static int toMonthNumber(String m) {
		String s = m.trim();
		if (s.chars().allMatch(Character::isDigit)) {
			return Integer.parseInt(s); // "1", "01", "12"
		}
		try {
			return Month.valueOf(s.toUpperCase(Locale.ROOT)).getValue();
		} catch (Exception ignore) {
		}
		try {
			return Month.from(DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH).parse(s)).getValue();
		} catch (Exception ignore) {
		}
		return Month.from(DateTimeFormatter.ofPattern("MMMM", Locale.ENGLISH).parse(s)).getValue(); // "January"
	}

	private final RepositoryManager interfaces;
	private final ModelMapper mapper;

	private final SecurityUtils securityUtil;

	public IncomeService(RepositoryManager interfaces, SecurityUtils securityUtil) {
		this.interfaces = interfaces;
		this.securityUtil = securityUtil;
		this.mapper = new ModelMapper();
	}

	public ResponseEntity<List<IncomeDto>> getUserIncomes() {
		return ResponseEntity
				.ok(this.interfaces.income.findByUserOrderByIncomeMonthAsc(this.securityUtil.getCurrentUser()).stream()
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

	public ResponseEntity<MontlyAndYearlySummaryDtos> getIncomeSummary() {
		MontlyAndYearlySummaryDtos montlyAndYearlySummaryDtos = new MontlyAndYearlySummaryDtos();
		User user = this.securityUtil.getCurrentUser();
		List<Income> incomes = this.interfaces.income.findByUserOrderByIncomeMonthAsc(user);
		Map<String, MontlyAndYearlySummaryDto> yearMap = new HashMap<>();
		Map<String, MontlyAndYearlySummaryDto> monthMap = new HashMap<>();
		String currentYear = "" + YearMonth.now().getYear();

		incomes.forEach(income -> {
			MontlyAndYearlySummaryDto monthData = monthMap.get(income.getIncomeMonth().getMonth().name());
			if (currentYear.equals("" + income.getIncomeMonth().getYear())) {
				if (monthData == null) {
					MontlyAndYearlySummaryDto newMonthData = new MontlyAndYearlySummaryDto();
					newMonthData.setAmount(income.getAmount());
					newMonthData.setMonth(income.getIncomeMonth().getMonth().name());
					monthMap.put(income.getIncomeMonth().getMonth().name(), newMonthData);
				} else {
					monthData.setAmount(monthData.getAmount().add(income.getAmount()));
				}
			}

			MontlyAndYearlySummaryDto yearData = yearMap.get("" + income.getIncomeMonth().getYear());
			if (yearData == null) {
				MontlyAndYearlySummaryDto newYearData = new MontlyAndYearlySummaryDto();
				newYearData.setAmount(income.getAmount());
				newYearData.setYear("" + income.getIncomeMonth().getYear());
				yearMap.put("" + income.getIncomeMonth().getYear(), newYearData);
			} else {
				yearData.setAmount(yearData.getAmount().add(income.getAmount()));
			}
		});

		montlyAndYearlySummaryDtos.getMonthSummary().addAll(
				monthMap.values().stream().sorted(Comparator.comparingInt(d -> toMonthNumber(d.getMonth()))).toList());

		montlyAndYearlySummaryDtos.getYearSummary().addAll(
				yearMap.values().stream().sorted(Comparator.comparingInt(d -> Integer.parseInt(d.getYear()))).toList());

		return ResponseEntity.ok(montlyAndYearlySummaryDtos);
	}
}
