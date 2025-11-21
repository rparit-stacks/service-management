package com.rps.servicecenter.service.impl;

import com.rps.servicecenter.dto.ServiceDTO;
import com.rps.servicecenter.dto.ServiceResponseDTO;
import com.rps.servicecenter.exception.ResourceNotFoundException;
import com.rps.servicecenter.mapper.ServiceMapper;
import com.rps.servicecenter.model.Service;
import com.rps.servicecenter.model.ServiceRequest;
import com.rps.servicecenter.model.User;
import com.rps.servicecenter.repository.ServiceRepository;
import com.rps.servicecenter.repository.ServiceRequestRepository;
import com.rps.servicecenter.repository.UserRepository;
import com.rps.servicecenter.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@Transactional
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceMapper serviceMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponseDTO> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(serviceMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceResponseDTO getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
        return serviceMapper.toResponseDTO(service);
    }

    @Override
    public ServiceResponseDTO saveService(ServiceDTO serviceDTO) {
        ServiceRequest serviceRequest = serviceRequestRepository.findById(serviceDTO.getServiceRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", serviceDTO.getServiceRequestId()));
        
        // User is optional - only set if userId is provided
        User user = null;
        if (serviceDTO.getUserId() != null) {
            user = userRepository.findById(serviceDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", serviceDTO.getUserId()));
        }
        
        Service service = serviceMapper.toEntity(serviceDTO, serviceRequest, user);
        Service savedService = serviceRepository.save(service);
        return serviceMapper.toResponseDTO(savedService);
    }

    @Override
    public ServiceResponseDTO updateService(Long id, ServiceDTO serviceDTO) {
        Service existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
        
        ServiceRequest serviceRequest = serviceRequestRepository.findById(serviceDTO.getServiceRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", serviceDTO.getServiceRequestId()));
        
        // User is optional - only set if userId is provided
        User user = null;
        if (serviceDTO.getUserId() != null) {
            user = userRepository.findById(serviceDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", serviceDTO.getUserId()));
        }
        
        serviceMapper.updateEntityFromDTO(serviceDTO, existingService, serviceRequest, user);
        Service updatedService = serviceRepository.save(existingService);
        return serviceMapper.toResponseDTO(updatedService);
    }

    @Override
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Service", id);
        }
        serviceRepository.deleteById(id);
    }
}

