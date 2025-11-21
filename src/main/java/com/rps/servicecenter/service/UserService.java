package com.rps.servicecenter.service;

import com.rps.servicecenter.dto.UserRequestDTO;
import com.rps.servicecenter.dto.UserResponseDTO;

import java.util.List;

public interface UserService {
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO getUserById(Long id);
    UserResponseDTO saveUser(UserRequestDTO userRequestDTO);
    UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO);
    void deleteUser(Long id);
}

