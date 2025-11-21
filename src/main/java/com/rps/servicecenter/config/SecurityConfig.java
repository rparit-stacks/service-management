package com.rps.servicecenter.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Static resources - Public
                .requestMatchers("/", "/index.html", "/css/**", "/js/**", "/images/**").permitAll()
                
                // Print endpoints - Authenticated users only
                .requestMatchers("/print/**").hasAnyRole("USER", "ADMIN")
                
                // Public endpoints - Authentication
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                
                // Authenticated endpoints - Profile management
                .requestMatchers("/api/auth/me", "/api/auth/logout", 
                                "/api/auth/change-password", "/api/auth/profile", 
                                "/api/auth/account").authenticated()
                
                // Admin only endpoints
                .requestMatchers("/api/users/**", "/api/brands/**").hasAnyRole("ADMIN")
                
                // Authenticated users (USER or ADMIN) - Business operations
                // Note: Customers are data entities, not users. Only USER/ADMIN can manage them.
                .requestMatchers("/api/customers/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/vehicles/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/service-requests/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/services/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/invoices/**").hasAnyRole("USER", "ADMIN")
                
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .securityContext(securityContext -> securityContext
                .securityContextRepository(securityContextRepository())
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
            );

        return http.build();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }
}

