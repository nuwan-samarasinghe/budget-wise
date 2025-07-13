package com.budgetwise.backend.controllers;

import com.budgetwise.backend.dto.CategoryDto;
import com.budgetwise.backend.services.CategoryService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/categories")
public class CategoryController {

	private final CategoryService categoryService;

	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	@GetMapping("")
	public ResponseEntity<List<CategoryDto>> getSalaries() {
		return this.categoryService.getUserCategories();
	}
}
