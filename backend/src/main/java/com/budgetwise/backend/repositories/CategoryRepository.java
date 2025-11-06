package com.budgetwise.backend.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.budgetwise.backend.models.Category;
import com.budgetwise.backend.models.User;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
	List<Category> findByUser(User user);

	Optional<Category> findByName(String name);
}
