package com.budgetwise.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SalaryDto {
	private String id;
	private BigDecimal amount;
	private LocalDate salaryMonth;
	private String source;
	private String note;
}
