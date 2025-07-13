package com.budgetwise.backend.services;

import com.budgetwise.backend.common.BudgetWiseException;
import com.budgetwise.backend.common.SecurityUtils;
import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.dto.SalaryDto;
import com.budgetwise.backend.models.Salary;
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
public class SalaryService {

	private final RepositoryManager interfaces;
	private final ModelMapper mapper;
	private final SecurityUtils securityUtil;

	public SalaryService(RepositoryManager interfaces, SecurityUtils securityUtil) {
		this.interfaces = interfaces;
		this.securityUtil = securityUtil;
		this.mapper = new ModelMapper();
	}

	public ResponseEntity<List<SalaryDto>> getUserSalaries() {
		return ResponseEntity.ok(this.interfaces.salary.findByUser(this.securityUtil.getCurrentUser()).stream()
				.map(salary -> this.mapper.map(salary, SalaryDto.class)).toList());
	}

	@Transactional
	public ResponseEntity<SalaryDto> createOrUpdateSalary(SalaryDto salaryDto) {
		Salary mappedSalary = this.mapper.map(salaryDto, Salary.class);
		mappedSalary.setUser(this.securityUtil.getCurrentUser());
		Salary saved = this.interfaces.salary.saveAndFlush(mappedSalary);
		return ResponseEntity.ok(this.mapper.map(saved, SalaryDto.class));
	}

	@Transactional
	public ResponseEntity<MessageDto> deleteSalary(UUID salaryId) {
		User user = this.securityUtil.getCurrentUser();
		Salary salary = this.interfaces.salary.findById(salaryId)
				.orElseThrow(() -> new BudgetWiseException("Given salary is not available"));
		if (salary.getUser().getId().equals(user.getId())) {
			this.interfaces.salary.delete(salary);
			return ResponseEntity.ok(new MessageDto(HttpStatus.OK.value(), "Successfully deleted"));
		} else {
			throw new AccessDeniedException("User does not have access.");
		}
	}
}
