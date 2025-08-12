package com.budgetwise.backend.common.data;

import com.budgetwise.backend.models.Budget;
import com.budgetwise.backend.models.Category;
import com.budgetwise.backend.repositories.BudgetRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

@Component
public class BudgetFactory extends AbstractFactory<Budget> {

	private final CacheManager cacheManager;

	protected BudgetFactory(BudgetRepository repository, CacheManager cacheManager) {
		super(repository);
		this.cacheManager = cacheManager;
	}

	@Override
	protected Budget build() {
		Budget budget = new Budget();
		budget.setAmount(BigDecimal.valueOf(faker.number().randomDouble(2, 3000, 10000)));
		budget.setNote(faker.lorem().sentence());
		budget.setAffectOn(LocalDate.now());
		List<Category> categories = cacheManager.getCache("categories").get("all", List.class);
		budget.setCategory(categories.getFirst());
		budget.setRecurrent(Boolean.FALSE);
		budget.setFromDate(LocalDate.now());
		budget.setToDate(LocalDate.now().plusDays(365));
		return budget;
	}
}
