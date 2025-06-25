package com.budgetwise.backend.repositories;

import com.budgetwise.backend.models.Expense;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
}
