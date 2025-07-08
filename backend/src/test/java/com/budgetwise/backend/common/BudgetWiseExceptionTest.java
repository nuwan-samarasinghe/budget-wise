package com.budgetwise.backend.common;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class BudgetWiseExceptionTest {

	@Test
	void constructor_withMessageAndCause_shouldStoreBoth() {
		Throwable cause = new IllegalArgumentException("root cause");
		BudgetWiseException ex = new BudgetWiseException("something went wrong", cause);

		assertEquals("something went wrong", ex.getMessage());
		assertSame(cause, ex.getCause());
	}

	@Test
	void constructor_withMessage_only() {
		BudgetWiseException ex = new BudgetWiseException("just a message");

		assertEquals("just a message", ex.getMessage());
		assertNull(ex.getCause());
	}

	@Test
	void constructor_withCause_only() {
		Throwable cause = new NullPointerException("null error");
		BudgetWiseException ex = new BudgetWiseException(cause);

		assertEquals(cause.toString(), ex.getMessage());
		assertSame(cause, ex.getCause());
	}

	@Test
	void isRuntimeException() {
		assertThrows(BudgetWiseException.class, () -> {
			throw new BudgetWiseException("oops");
		});
	}
}
