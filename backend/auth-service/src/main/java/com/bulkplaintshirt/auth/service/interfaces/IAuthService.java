package com.bulkplaintshirt.auth.service.interfaces;

import com.bulkplaintshirt.auth.dto.LoginResponse;
import com.bulkplaintshirt.auth.dto.UserDto;
import com.bulkplaintshirt.auth.model.User;

import java.util.List;

public interface IAuthService {
    LoginResponse register(String username, String password, String email, User.Role role);
    LoginResponse login(String username, String password, String captcha);
    List<UserDto> getAllUsers();
    UserDto createUser(String username, String password, String email, User.Role role);
    void deleteUser(Long id);
    UserDto updateUserRole(Long id, User.Role role);
}
