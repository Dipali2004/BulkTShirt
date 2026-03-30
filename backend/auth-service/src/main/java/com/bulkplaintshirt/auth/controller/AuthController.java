package com.bulkplaintshirt.auth.controller;

import com.bulkplaintshirt.auth.dto.LoginResponse;
import com.bulkplaintshirt.auth.dto.UserDto;
import com.bulkplaintshirt.auth.model.User;
import com.bulkplaintshirt.auth.service.interfaces.IAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final IAuthService authService;

    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest request) {
        System.out.println("DEBUG: AuthController.register() reached for user: " + request.getUsername());
        try {
            LoginResponse response = authService.register(request.getUsername(), request.getPassword(), request.getEmail(), request.getRole());
            System.out.println("DEBUG: Registration successful for user: " + request.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("DEBUG: Registration error: " + e.getMessage());
            throw e;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        System.out.println("Login request received for: " + request.getUsername());
        return ResponseEntity.ok(authService.login(request.getUsername(), request.getPassword(), request.getCaptcha()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/csrf-token")
    public ResponseEntity<Void> getCsrfToken(org.springframework.security.web.csrf.CsrfToken token) {
        // Explicitly touch the token to ensure it's generated and sent as a cookie
        System.out.println("CSRF Token initialized: " + token.getToken());
        return ResponseEntity.ok().build();
    }

    // Admin APIs for User Management
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createUser(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(authService.createUser(request.getUsername(), request.getPassword(), request.getEmail(), request.getRole()));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable Long id, @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(authService.updateUserRole(id, request.getRole()));
    }

    public static class CreateUserRequest {
        private String username;
        private String password;
        private String email;
        private User.Role role;

        public CreateUserRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
    }

    public static class UpdateRoleRequest {
        private User.Role role;
        public UpdateRoleRequest() {}
        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
    }

    public static class RegisterRequest {
        private String username;
        private String password;
        private String email;
        private User.Role role;

        public RegisterRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
    }

    public static class LoginRequest {
        private String username;
        private String password;
        private String captcha;

        public LoginRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getCaptcha() { return captcha; }
        public void setCaptcha(String captcha) { this.captcha = captcha; }
    }
}
