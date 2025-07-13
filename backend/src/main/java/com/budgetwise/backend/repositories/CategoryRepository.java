package com.budgetwise.backend.repositories;

import com.budgetwise.backend.models.Category;
import com.budgetwise.backend.models.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
	List<Category> findByUser(User user);

	@Query("SELECT c FROM bwise_category c WHERE c.user = :user OR c.user IS NULL")
	List<Category> findByUserOrGlobal(@Param("user") User user);
}
