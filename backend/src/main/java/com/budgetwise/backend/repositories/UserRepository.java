package com.budgetwise.backend.repositories;

import com.budgetwise.backend.models.User;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
}
