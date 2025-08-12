package com.budgetwise.backend.controllers;

import com.budgetwise.backend.dto.DashboardDto;
import com.budgetwise.backend.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/dashboard")
public class DashboardController {

	@Autowired
	private DashboardService dashboard;

	@GetMapping("")
	public ResponseEntity<DashboardDto> getDashboardDetails() {
		return dashboard.getDashboardDetails();
	}
}
