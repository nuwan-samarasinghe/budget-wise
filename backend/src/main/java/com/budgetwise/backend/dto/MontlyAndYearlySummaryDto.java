package com.budgetwise.backend.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class MontlyAndYearlySummaryDto {
	private String month;
	private String year;
	private BigDecimal amount;
}
