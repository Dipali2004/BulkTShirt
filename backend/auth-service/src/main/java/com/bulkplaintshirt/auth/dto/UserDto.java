package com.bulkplaintshirt.auth.dto;

import com.bulkplaintshirt.auth.model.User;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private User.Role role;

    public UserDto() {}

    public UserDto(Long id, String username, String email, User.Role role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }
}
