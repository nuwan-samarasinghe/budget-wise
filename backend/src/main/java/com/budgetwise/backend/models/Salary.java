package com.budgetwise.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Entity(name = "bwise_salary")
@Table(name = "bwise_salary", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "salary_month"})})
public class Salary extends BaseModel {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	private BigDecimal amount;

	private String source;

	@Column(name = "salary_month", nullable = false)
	private LocalDate salaryMonth;

	private String note;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
}
