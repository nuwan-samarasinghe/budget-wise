package com.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RecurringSubscriptions {
	private String category;
	private double amount;
	private String note;
}
