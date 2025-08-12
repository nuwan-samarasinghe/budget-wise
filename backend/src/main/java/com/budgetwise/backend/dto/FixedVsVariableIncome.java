package com.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FixedVsVariableIncome {
	private String month;
	private double fixed;
	private double variable;
}
