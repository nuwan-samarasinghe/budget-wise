package com.budgetwise.backend.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.budgetwise.backend.models.Budget;
import com.budgetwise.backend.models.User;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {
	List<Budget> findByUserOrderByBudgetMonthAsc(User user);
}
