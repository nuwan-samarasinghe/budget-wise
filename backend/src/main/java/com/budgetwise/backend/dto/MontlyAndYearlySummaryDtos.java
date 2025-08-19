package com.budgetwise.backend.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class MontlyAndYearlySummaryDtos {
	private List<MontlyAndYearlySummaryDto> monthSummary = new ArrayList<>();
	private List<MontlyAndYearlySummaryDto> yearSummary = new ArrayList<>();
}
