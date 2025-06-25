package com.budgetwise.backend.repositories;

import com.budgetwise.backend.models.Category;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
}
