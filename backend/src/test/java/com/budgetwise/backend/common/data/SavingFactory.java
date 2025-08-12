package com.budgetwise.backend.common.data;

import com.budgetwise.backend.models.Saving;
import com.budgetwise.backend.repositories.SavingRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class SavingFactory extends AbstractFactory<Saving> {

	protected SavingFactory(SavingRepository repository) {
		super(repository);
	}

	@Override
	protected Saving build() {
		Saving saving = new Saving();
		saving.setAmount(BigDecimal.valueOf(faker.number().randomDouble(2, 3000, 10000)));
		saving.setNote(faker.lorem().sentence());
		saving.setAffectOn(LocalDate.now());
		saving.setRecurrent(Boolean.FALSE);
		saving.setFromDate(LocalDate.now());
		saving.setToDate(LocalDate.now().plusDays(365));
		return saving;
	}
}
