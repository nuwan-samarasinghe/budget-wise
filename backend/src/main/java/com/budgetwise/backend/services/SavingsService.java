package com.budgetwise.backend.services;

import com.budgetwise.backend.common.BudgetWiseException;
import com.budgetwise.backend.common.SecurityUtils;
import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.dto.SavingDto;
import com.budgetwise.backend.models.Saving;
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
public class SavingsService {

	private final RepositoryManager interfaces;
	private final ModelMapper mapper;
	private final SecurityUtils securityUtil;

	public SavingsService(RepositoryManager interfaces, SecurityUtils securityUtil) {
		this.interfaces = interfaces;
		this.securityUtil = securityUtil;
		this.mapper = new ModelMapper();
	}

	public ResponseEntity<List<SavingDto>> getAllSavings() {
		return ResponseEntity.ok(this.interfaces.savings.findByUser(this.securityUtil.getCurrentUser()).stream()
				.map(saving -> this.mapper.map(saving, SavingDto.class)).toList());
	}

	@Transactional
	public ResponseEntity<SavingDto> createOrUpdateSavings(SavingDto dto) {
		Saving mappedSaving = this.mapper.map(dto, Saving.class);
		mappedSaving.setUser(this.securityUtil.getCurrentUser());
		Saving saved = this.interfaces.savings.saveAndFlush(mappedSaving);
		return ResponseEntity.ok(this.mapper.map(saved, SavingDto.class));
	}

	@Transactional
	public ResponseEntity<MessageDto> deleteSavings(UUID savingId) {
		User user = this.securityUtil.getCurrentUser();
		Saving saving = this.interfaces.savings.findById(savingId)
				.orElseThrow(() -> new BudgetWiseException("Given saving is not available"));
		if (saving.getUser().getId().equals(user.getId())) {
			this.interfaces.savings.delete(saving);
			return ResponseEntity.ok(new MessageDto(HttpStatus.OK.value(), "Successfully deleted"));
		} else {
			throw new AccessDeniedException("User does not have access.");
		}
	}
}
