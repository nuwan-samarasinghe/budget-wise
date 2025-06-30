package com.budgetwise.backend.dto;

public class ApiErrorResponse extends MessageDto {
	public ApiErrorResponse(Integer status, String message) {
		super(status, message);
	}
}
