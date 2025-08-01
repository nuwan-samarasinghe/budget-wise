package com.budgetwise.backend.dto;

import java.math.BigDecimal;
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
	private String source;
	private String note;
	private CategoryDto category;
}
