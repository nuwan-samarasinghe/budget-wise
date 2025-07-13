package com.budgetwise.backend.common.data;

import com.budgetwise.backend.models.Budget;
import com.budgetwise.backend.repositories.BudgetRepository;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class BudgetFactory extends AbstractFactory<Budget> {

	protected BudgetFactory(BudgetRepository repository) {
		super(repository);
	}

	@Override
	protected Budget build() {
		Budget budget = new Budget();
		budget.setAmount(BigDecimal.valueOf(faker.number().randomDouble(2, 3000, 10000)));
		String source = faker.company().name();
		budget.setNote(faker.lorem().sentence());
		budget.setSource(source);
		return budget;
	}
}
