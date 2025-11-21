package com.rps.servicecenter.service;

import com.rps.servicecenter.dto.ServiceDTO;
import com.rps.servicecenter.dto.ServiceResponseDTO;

import java.util.List;

public interface ServiceService {
    List<ServiceResponseDTO> getAllServices();
    ServiceResponseDTO getServiceById(Long id);
    ServiceResponseDTO saveService(ServiceDTO serviceDTO);
    ServiceResponseDTO updateService(Long id, ServiceDTO serviceDTO);
    void deleteService(Long id);
}

