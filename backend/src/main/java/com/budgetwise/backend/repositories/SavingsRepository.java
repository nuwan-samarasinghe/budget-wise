package com.budgetwise.backend.repositories;

import com.budgetwise.backend.models.Savings;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavingsRepository extends JpaRepository<Savings, UUID> {
}
