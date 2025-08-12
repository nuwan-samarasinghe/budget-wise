package com.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MonthlyIncomeAndExpense {
	private String month;
	private Integer year;
	private double income;
	private double expense;
}
