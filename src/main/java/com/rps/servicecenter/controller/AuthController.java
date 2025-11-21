package com.rps.servicecenter.controller;

import com.rps.servicecenter.dto.AuthResponseDTO;
import com.rps.servicecenter.dto.ChangePasswordDTO;
import com.rps.servicecenter.dto.LoginRequestDTO;
import com.rps.servicecenter.dto.RegisterRequestDTO;
import com.rps.servicecenter.dto.UpdateProfileDTO;
import com.rps.servicecenter.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private HttpServletRequest request;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        AuthResponseDTO response = authService.register(registerRequest);
        
        // Auto-login after registration - create session
        HttpSession session = request.getSession(true);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        AuthResponseDTO response = authService.login(loginRequest);
        
        // Ensure session is created and SecurityContext is saved
        HttpSession session = request.getSession(true);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            SecurityContextHolder.clearContext();
        }
        // Invalidate session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponseDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            com.rps.servicecenter.model.AuthUser user = (com.rps.servicecenter.model.AuthUser) authentication.getPrincipal();
            AuthResponseDTO response = new AuthResponseDTO(
                    "Current user",
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole()
            );
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/change-password")
    public ResponseEntity<AuthResponseDTO> changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        AuthResponseDTO response = authService.changePassword(changePasswordDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponseDTO> updateProfile(@Valid @RequestBody UpdateProfileDTO updateProfileDTO) {
        AuthResponseDTO response = authService.updateProfile(updateProfileDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/account")
    public ResponseEntity<String> deleteAccount() {
        authService.deleteAccount();
        return ResponseEntity.ok("Account deleted successfully");
    }
}
