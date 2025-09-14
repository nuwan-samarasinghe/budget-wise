package com.budgetwise.backend.models;

import com.budgetwise.backend.common.types.IncomeType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Entity(name = "bwise_income")
@Table(name = "bwise_income", schema = "public", uniqueConstraints = {
		@UniqueConstraint(columnNames = {"user_id", "salary_month"})})
public class Income extends BaseModel {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	private BigDecimal amount;
	private String source;
	private String note;

	@Column(name = "income_month", nullable = false)
	@Convert(converter = YearMonthDateAttributeConverter.class)
	private YearMonth incomeMonth;

	@Enumerated
	private IncomeType incomeType;

	@Column(nullable = false)
	private Boolean recurrent = Boolean.FALSE;

	@Column(name = "from_date", nullable = true)
	private LocalDate fromDate;

	@Column(name = "to_date", nullable = true)
	private LocalDate toDate;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@PrePersist
	@PreUpdate
	private void validateRecurrentFields() {
		if (Boolean.TRUE.equals(recurrent) && (fromDate == null || toDate == null)) {
			throw new IllegalArgumentException("Fields 'from' and 'to' must be set if 'recurrent' is true.");
		}
	}
}
