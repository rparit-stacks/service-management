package com.rps.servicecenter.service.impl;

import com.rps.servicecenter.dto.UserRequestDTO;
import com.rps.servicecenter.dto.UserResponseDTO;
import com.rps.servicecenter.exception.ResourceNotFoundException;
import com.rps.servicecenter.mapper.UserMapper;
import com.rps.servicecenter.model.User;
import com.rps.servicecenter.repository.UserRepository;
import com.rps.servicecenter.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return userMapper.toResponseDTO(user);
    }

    @Override
    public UserResponseDTO saveUser(UserRequestDTO userRequestDTO) {
        User user = userMapper.toEntity(userRequestDTO);
        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        
        userMapper.updateEntityFromDTO(userRequestDTO, existingUser);
        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponseDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", id);
        }
        userRepository.deleteById(id);
    }
}

