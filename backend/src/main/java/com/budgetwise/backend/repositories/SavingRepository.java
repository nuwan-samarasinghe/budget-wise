package com.budgetwise.backend.repositories;

import com.budgetwise.backend.models.Saving;
import com.budgetwise.backend.models.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavingRepository extends JpaRepository<Saving, UUID> {
	List<Saving> findByUser(User user);
}
