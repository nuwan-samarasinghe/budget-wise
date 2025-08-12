package com.budgetwise.backend.dto;

import com.budgetwise.backend.common.types.IncomeType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class IncomeDto {
	private String id;
	@NotNull
	private BigDecimal amount;
	private String source;
	private String note;
	private LocalDate incomeMonth;
	private IncomeType incomeType;
	private Boolean recurrent;
	private LocalDate from;
	private LocalDate to;

	@AssertTrue(message = "From and To must be provided when recurrent is true")
	public boolean isFromToValid() {
		if (Boolean.TRUE.equals(recurrent)) {
			return from != null && to != null;
		}
		return true;
	}
}
