package com.budgetwise.backend.repositories;

import com.budgetwise.backend.models.Income;
import com.budgetwise.backend.models.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeRepository extends JpaRepository<Income, UUID> {
	List<Income> findByUser(User user);
}
