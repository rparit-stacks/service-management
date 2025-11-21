package com.rps.servicecenter.service;

import com.rps.servicecenter.dto.ServiceRequestDTO;
import com.rps.servicecenter.dto.ServiceRequestResponseDTO;

import java.util.List;

public interface ServiceRequestService {
    List<ServiceRequestResponseDTO> getAllServiceRequests();
    ServiceRequestResponseDTO getServiceRequestById(Long id);
    ServiceRequestResponseDTO saveServiceRequest(ServiceRequestDTO serviceRequestDTO);
    ServiceRequestResponseDTO updateServiceRequest(Long id, ServiceRequestDTO serviceRequestDTO);
    void deleteServiceRequest(Long id);
}

