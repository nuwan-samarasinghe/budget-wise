package com.budgetwise.backend.common.data;

import com.budgetwise.backend.models.Income;
import com.budgetwise.backend.repositories.IncomeRepository;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneId;
import org.springframework.stereotype.Component;

@Component
public class IncomeFactory extends AbstractFactory<Income> {

	protected IncomeFactory(IncomeRepository repository) {
		super(repository);
	}

	@Override
	protected Income build() {
		Income salary = new Income();
		salary.setAmount(BigDecimal.valueOf(faker.number().randomDouble(2, 3000, 10000)));
		String source = faker.company().name();
		LocalDate salaryMonth = faker.date()
				.between(Date.from(LocalDate.now().minusYears(1).atStartOfDay(ZoneId.systemDefault()).toInstant()),
						Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()))
				.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		salary.setNote(faker.lorem().sentence());
		salary.setIncomeMonth(salaryMonth);
		salary.setSource(source);
		return salary;
	}
}
