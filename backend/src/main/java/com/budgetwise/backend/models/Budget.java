package com.budgetwise.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Entity(name = "bwise_budget")
public class Budget extends BaseModel {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	private BigDecimal amount;
	private String note;
	private LocalDate affectOn;

	@Column(nullable = false)
	private Boolean recurrent = Boolean.FALSE;

	@Column(name = "from_date", nullable = true)
	private LocalDate fromDate;

	@Column(name = "to_date", nullable = true)
	private LocalDate toDate;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;

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
