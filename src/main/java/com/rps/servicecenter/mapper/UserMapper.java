package com.rps.servicecenter.mapper;

import com.rps.servicecenter.dto.ServiceResponseDTO;
import com.rps.servicecenter.dto.UserRequestDTO;
import com.rps.servicecenter.dto.UserResponseDTO;
import com.rps.servicecenter.model.Service;
import com.rps.servicecenter.model.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public User toEntity(UserRequestDTO dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
        return user;
    }

    public UserResponseDTO toResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setEmail(user.getEmail());
        
        if (user.getJobs() != null) {
            List<ServiceResponseDTO> serviceDTOs = user.getJobs().stream()
                    .map(this::toServiceResponseDTO)
                    .collect(Collectors.toList());
            dto.setJobs(serviceDTOs);
        }
        
        return dto;
    }

    public void updateEntityFromDTO(UserRequestDTO dto, User user) {
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
    }

    private ServiceResponseDTO toServiceResponseDTO(Service service) {
        ServiceResponseDTO dto = new ServiceResponseDTO();
        dto.setId(service.getId());
        dto.setDescription(service.getDescription());
        dto.setJobName(service.getJobName());
        dto.setCost(service.getCost());
        if (service.getServiceRequest() != null) {
            dto.setServiceRequestId(service.getServiceRequest().getId());
        }
        if (service.getUser() != null) {
            dto.setUserId(service.getUser().getId());
            dto.setUserName(service.getUser().getFullName());
        }
        return dto;
    }
}






