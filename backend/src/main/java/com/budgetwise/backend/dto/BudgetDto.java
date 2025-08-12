package com.budgetwise.backend.dto;

import jakarta.validation.constraints.AssertTrue;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BudgetDto {
	private UUID id;
	private BigDecimal amount;
	private String note;
	private CategoryDto category;
	private LocalDate affectOn;
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
