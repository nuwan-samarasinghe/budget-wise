package com.budgetwise.backend.common;

import com.budgetwise.backend.models.User;
import com.budgetwise.backend.repositories.RepositoryManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
	private final RepositoryManager repositoryManager;

	public SecurityUtils(RepositoryManager repositoryManager) {
		this.repositoryManager = repositoryManager;
	}

	public User getCurrentUser() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal != null) {
			String username = ((User) principal).getUsername();
			return repositoryManager.user.findByUsername(username)
					.orElseThrow(() -> new BudgetWiseException("User not available"));
		} else {
			throw new BudgetWiseException("Invalid authentication principal");
		}
	}
}
