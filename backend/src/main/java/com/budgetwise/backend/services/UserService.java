package com.budgetwise.backend.services;

import com.budgetwise.backend.dto.AuthDto;
import com.budgetwise.backend.dto.MessageDto;
import com.budgetwise.backend.models.User;
import com.budgetwise.backend.repositories.RepositoryManager;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {

	private final RepositoryManager interfaces;
	private final PasswordEncoder passwordEn;
	private final JwtService jwtService;

	@Value("${jwt.expirationMs}")
	private long expMs;

	public UserService(RepositoryManager interfaces, PasswordEncoder passwordEn, JwtService jwtService) {
		this.interfaces = interfaces;
		this.passwordEn = passwordEn;
		this.jwtService = jwtService;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return interfaces.user.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}

	@Transactional
	public ResponseEntity<MessageDto> cereateUser(AuthDto dto) {
		User user = new User();
		user.setUsername(dto.getUsername());
		user.setPassword(this.passwordEn.encode(dto.getPassword()));
		interfaces.user.saveAndFlush(user);
		return new ResponseEntity<>(new MessageDto(HttpStatus.CREATED.value(), "User Created"), HttpStatus.CREATED);
	}

	public ResponseEntity<MessageDto> loginUser(Authentication authentication, HttpServletResponse response) {
		String jwt = jwtService.generateToken(((User) authentication.getPrincipal()));
		Cookie cookie = new Cookie("USER_SESSSION", jwt);
		cookie.setHttpOnly(true);
		cookie.setPath("/");
		cookie.setSecure(true);
		cookie.setMaxAge((int) expMs * 60);
		response.addCookie(cookie);
		return ResponseEntity.ok(new MessageDto(HttpStatus.OK.value(), "Logged In"));
	}

	public ResponseEntity<MessageDto> logOut(HttpServletResponse response) {
		Cookie cookie = new Cookie("USER_SESSSION", "");
		cookie.setPath("/");
		cookie.setSecure(true);
		cookie.setHttpOnly(true);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		return ResponseEntity.ok(new MessageDto(HttpStatus.OK.value(), "Logged Out"));
	}
}
