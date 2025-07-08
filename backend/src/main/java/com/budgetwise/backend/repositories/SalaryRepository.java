package com.budgetwise.backend.repositories;

import com.budgetwise.backend.models.Salary;
import com.budgetwise.backend.models.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaryRepository extends JpaRepository<Salary, UUID> {
	List<Salary> findByUser(User user);
}
