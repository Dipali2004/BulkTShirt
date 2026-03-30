package com.bulkplaintshirt.auth.service;

import com.bulkplaintshirt.auth.dto.LoginResponse;
import com.bulkplaintshirt.auth.dto.UserDto;
import com.bulkplaintshirt.auth.exception.ApiException;
import com.bulkplaintshirt.auth.model.User;
import com.bulkplaintshirt.auth.repository.UserRepository;
import com.bulkplaintshirt.auth.security.jwt.JwtService;
import com.bulkplaintshirt.auth.service.interfaces.IAuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public LoginResponse register(String username, String password, String email, User.Role role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new ApiException("Username already exists", "USER_EXISTS");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ApiException("Email already exists", "EMAIL_EXISTS");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole(role != null ? role : User.Role.ROLE_USER);
        userRepository.save(user);
        
        String token = jwtService.generateToken(user);
        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
        return new LoginResponse(token, userDto);
    }

    @Override
    public LoginResponse login(String username, String password, String captcha) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (Exception e) {
            throw new ApiException("Invalid credentials", "AUTH_FAILED");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found", "USER_NOT_FOUND"));
        
        String token = jwtService.generateToken(user);
        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
        return new LoginResponse(token, userDto);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole()))
                .collect(Collectors.toList());
    }

    @Override
    public UserDto createUser(String username, String password, String email, User.Role role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new ApiException("Username already exists", "USER_EXISTS");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole(role);
        userRepository.save(user);
        return new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ApiException("User not found", "USER_NOT_FOUND");
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDto updateUserRole(Long id, User.Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", "USER_NOT_FOUND"));
        user.setRole(role);
        userRepository.save(user);
        return new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }
}
