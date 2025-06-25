package com.budgetwise.backend.common.data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import net.datafaker.Faker;
import org.springframework.data.jpa.repository.JpaRepository;

public abstract class AbstractFactory<T> {

	protected static final Faker faker = new Faker();

	protected final JpaRepository<T, UUID> repository;

	protected AbstractFactory(JpaRepository<T, UUID> repository) {
		this.repository = repository;
	}

	protected abstract T build();

	public T createAndPersist() {
		T entity = build();
		return repository.saveAndFlush(entity);
	}

	public List<T> createAndPersist(int count) {
		List<T> entities = new ArrayList<>();
		for (int i = 0; i < count; i++) {
			entities.add(build());
		}
		return repository.saveAllAndFlush(entities);
	}
}
