package com.budgetwise.backend.common;

public class BudgetWiseException extends RuntimeException {

	public BudgetWiseException(String message, Throwable error) {
		super(message, error);
	}

	public BudgetWiseException(String message) {
		super(message);
	}

	public BudgetWiseException(Throwable error) {
		super(error);
	}
}
