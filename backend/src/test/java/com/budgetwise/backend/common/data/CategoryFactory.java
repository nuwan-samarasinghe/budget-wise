package com.budgetwise.backend.common.data;

import com.budgetwise.backend.models.Category;
import com.budgetwise.backend.repositories.CategoryRepository;
import org.springframework.stereotype.Component;

@Component
public class CategoryFactory extends AbstractFactory<Category> {

	protected CategoryFactory(CategoryRepository repository) {
		super(repository);
	}

	@Override
	protected Category build() {
		Category category = new Category();
		category.setName(faker.finalFantasyXIV().zone());
		return category;
	}
}
