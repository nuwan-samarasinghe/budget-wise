package com.budgetwise.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ServiceManager {
	public final JwtService jwt;
	public final UserService user;
}
