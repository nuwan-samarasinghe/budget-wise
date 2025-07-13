package com.budgetwise.backend.services;

import com.budgetwise.backend.common.SecurityUtils;
import com.budgetwise.backend.dto.CategoryDto;
import com.budgetwise.backend.repositories.RepositoryManager;
import java.util.List;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

	private final RepositoryManager interfaces;
	private final ModelMapper mapper;
	private final SecurityUtils securityUtil;

	public CategoryService(RepositoryManager interfaces, SecurityUtils securityUtil) {
		this.interfaces = interfaces;
		this.securityUtil = securityUtil;
		this.mapper = new ModelMapper();
	}

	public ResponseEntity<List<CategoryDto>> getUserCategories() {
		return ResponseEntity.ok(this.interfaces.category.findByUserOrGlobal(this.securityUtil.getCurrentUser())
				.stream().map(salary -> this.mapper.map(salary, CategoryDto.class)).toList());
	}
}
