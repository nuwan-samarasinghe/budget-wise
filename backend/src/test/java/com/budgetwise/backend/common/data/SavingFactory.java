package com.budgetwise.backend.common.data;

import com.budgetwise.backend.models.Saving;
import com.budgetwise.backend.repositories.SavingRepository;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
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
		LocalDate savingMonth = faker.date()
				.between(Date.from(LocalDate.now().minusYears(1).atStartOfDay(ZoneId.systemDefault()).toInstant()),
						Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()))
				.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		saving.setNote(faker.lorem().sentence());
		saving.setSavingMonth(YearMonth.from(savingMonth));
		saving.setAffectOn(LocalDate.now());
		saving.setRecurrent(Boolean.FALSE);
		saving.setFromDate(LocalDate.now());
		saving.setToDate(LocalDate.now().plusDays(365));
		return saving;
	}
}
