package com.budgetwise.backend.common;

import com.budgetwise.backend.models.Category;
import com.budgetwise.backend.repositories.CategoryRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

	private final CategoryRepository categoryRepository;
	private final CacheManager cacheManager;

	public DataInitializer(CategoryRepository categoryRepository, CacheManager cacheManager) {
		this.categoryRepository = categoryRepository;
		this.cacheManager = cacheManager;
	}

	@Override
	public void run(ApplicationArguments args) throws Exception {
		List<String> categoryNames = List.of("Rent", "Mortgage", "Property Taxes", "Counsil Taxes", "Home Insurance",
				"Maintenance & Repairs", "Electricity", "Home Country Maintainance", "Water", "Gas", "Trash",
				"Internet", "Phone", "Groceries", "Dining Out", "Coffee / Snacks", "Fuel", "Public Transit",
				"Car Payment", "Car Insurance", "Parking", "Car Repairs", "Health Insurance", "Medical Bills",
				"Medications", "Gym Membership", "Toiletries", "Haircuts / Grooming", "Childcare", "School Supplies",
				"Kids’ Activities", "Tuition", "Clothing", "Electronics", "Household Items", "Gifts",
				"Streaming Services", "Subscriptions", "Hobbies", "Vacations", "Movies / Events", "Books",
				"Courses / Learning", "Student Loans", "Credit Card Payments", "Bank Fees", "Investments", "Savings",
				"Pet Food", "Vet Visits", "Pet Insurance", "Pet Supplies", "Commuting", "Office Supplies", "Uniforms",
				"Donations", "Emergency Fund", "Miscellaneous");
		List<Category> defaultCategories = new ArrayList<>();
		for (String name : categoryNames) {
			if (!categoryRepository.findByName(name).isPresent()) {
				Category category = new Category();
				category.setName(name);
				defaultCategories.add(category);
			}
		}

		if (!defaultCategories.isEmpty()) {
			categoryRepository.saveAll(defaultCategories);
		}

		List<Category> allCategories = categoryRepository.findAll();
		cacheManager.getCache("categories").put("all", allCategories);
	}
}
