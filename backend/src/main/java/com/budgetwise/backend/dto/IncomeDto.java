package com.budgetwise.backend.dto;

import com.budgetwise.backend.common.types.IncomeType;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class IncomeDto {
	private String id;
	@NotNull
	private BigDecimal amount;
	private String source;
	private String note;

	@NotNull
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM")
	@JsonSerialize(using = YearMonthSerializer.class)
	@JsonDeserialize(using = YearMonthDeserializer.class)
	private YearMonth incomeMonth;

	private IncomeType incomeType;
	private Boolean recurrent;
	private LocalDate fromDate;
	private LocalDate toDate;

	@AssertTrue(message = "From and To must be provided when recurrent is true")
	public boolean isFromToValid() {
		if (Boolean.TRUE.equals(recurrent)) {
			return fromDate != null && toDate != null;
		}
		return true;
	}
}
