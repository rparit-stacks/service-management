package com.rps.servicecenter.service;

import com.rps.servicecenter.dto.AuthResponseDTO;
import com.rps.servicecenter.dto.ChangePasswordDTO;
import com.rps.servicecenter.dto.LoginRequestDTO;
import com.rps.servicecenter.dto.RegisterRequestDTO;
import com.rps.servicecenter.dto.UpdateProfileDTO;
import com.rps.servicecenter.exception.ResourceNotFoundException;
import com.rps.servicecenter.model.AuthUser;
import com.rps.servicecenter.repository.AuthUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private AuthUserRepository authUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponseDTO register(RegisterRequestDTO registerRequest) {
        if (authUserRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (authUserRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        AuthUser user = new AuthUser();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : "USER");
        user.setEnabled(true);

        AuthUser savedUser = authUserRepository.save(user);

        // Auto-authenticate after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getUsername(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new AuthResponseDTO(
                "User registered successfully",
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        AuthUser user = (AuthUser) authentication.getPrincipal();

        return new AuthResponseDTO(
                "Login successful",
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    public AuthResponseDTO changePassword(ChangePasswordDTO changePasswordDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        AuthUser user = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));

        // Verify current password
        if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        authUserRepository.save(user);

        return new AuthResponseDTO(
                "Password changed successfully",
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    public AuthResponseDTO updateProfile(UpdateProfileDTO updateProfileDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        AuthUser user = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));

        // Check if email already exists for another user
        if (!user.getEmail().equals(updateProfileDTO.getEmail())) {
            if (authUserRepository.existsByEmail(updateProfileDTO.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
        }

        user.setEmail(updateProfileDTO.getEmail());
        AuthUser updatedUser = authUserRepository.save(user);

        return new AuthResponseDTO(
                "Profile updated successfully",
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getRole()
        );
    }

    public void deleteAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        AuthUser user = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));

        authUserRepository.delete(user);
        SecurityContextHolder.clearContext();
    }
}

