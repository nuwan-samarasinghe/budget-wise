package com.budgetwise.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Entity(name = "bwise_savings")
public class Saving extends BaseModel {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	private BigDecimal amount;

	private String notes;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
}
