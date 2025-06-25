package com.budgetwise.backend.repositories;

import com.budgetwise.backend.models.Budget;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {
}
