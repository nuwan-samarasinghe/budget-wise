package com.budgetwise.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.YearMonthDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.YearMonthSerializer;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SavingDto {
	private UUID id;

	private BigDecimal amount;
	private String note;
	private LocalDate affectOn;

	@NotNull
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM")
	@JsonSerialize(using = YearMonthSerializer.class)
	@JsonDeserialize(using = YearMonthDeserializer.class)
	private YearMonth savingMonth;

	private Boolean recurrent;
	private LocalDate from;
	private LocalDate to;

	@AssertTrue(message = "From and To must be provided when recurrent is true")
	public boolean isFromToValid() {
		if (Boolean.TRUE.equals(recurrent)) {
			return from != null && to != null;
		}
		return true;
	}
}
