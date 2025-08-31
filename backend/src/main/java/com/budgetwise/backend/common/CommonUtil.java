package com.budgetwise.backend.common;

import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class CommonUtil {
	public static int toMonthNumber(String m) {
		String s = m.trim();
		if (s.chars().allMatch(Character::isDigit)) {
			return Integer.parseInt(s); // "1", "01", "12"
		}
		try {
			return Month.valueOf(s.toUpperCase(Locale.ROOT)).getValue();
		} catch (Exception ignore) {
		}
		try {
			return Month.from(DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH).parse(s)).getValue();
		} catch (Exception ignore) {
		}
		return Month.from(DateTimeFormatter.ofPattern("MMMM", Locale.ENGLISH).parse(s)).getValue(); // "January"
	}
}
