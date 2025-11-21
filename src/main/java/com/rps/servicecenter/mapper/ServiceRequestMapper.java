package com.rps.servicecenter.mapper;

import com.rps.servicecenter.dto.ServiceRequestDTO;
import com.rps.servicecenter.dto.ServiceRequestResponseDTO;
import com.rps.servicecenter.dto.ServiceResponseDTO;
import com.rps.servicecenter.model.Service;
import com.rps.servicecenter.model.ServiceRequest;
import com.rps.servicecenter.model.Vehicle;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ServiceRequestMapper {

    public ServiceRequest toEntity(ServiceRequestDTO dto, Vehicle vehicle) {
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setDescription(dto.getDescription());
        serviceRequest.setStatus(dto.getStatus());
        serviceRequest.setVehicle(vehicle);
        return serviceRequest;
    }

    public ServiceRequestResponseDTO toResponseDTO(ServiceRequest serviceRequest) {
        ServiceRequestResponseDTO dto = new ServiceRequestResponseDTO();
        dto.setId(serviceRequest.getId());
        dto.setDescription(serviceRequest.getDescription());
        dto.setStatus(serviceRequest.getStatus());
        
        if (serviceRequest.getVehicle() != null) {
            dto.setVehicleId(serviceRequest.getVehicle().getId());
            dto.setVehicleNumber(serviceRequest.getVehicle().getNumber());
            
            // Get customer info from vehicle
            if (serviceRequest.getVehicle().getCustomer() != null) {
                dto.setCustomerId(serviceRequest.getVehicle().getCustomer().getId());
                dto.setCustomerName(serviceRequest.getVehicle().getCustomer().getFullName());
            }
        }
        
        if (serviceRequest.getJobs() != null) {
            List<ServiceResponseDTO> serviceDTOs = serviceRequest.getJobs().stream()
                    .map(this::toServiceResponseDTO)
                    .collect(Collectors.toList());
            dto.setJobs(serviceDTOs);
        }
        
        return dto;
    }

    public void updateEntityFromDTO(ServiceRequestDTO dto, ServiceRequest serviceRequest, Vehicle vehicle) {
        serviceRequest.setDescription(dto.getDescription());
        serviceRequest.setStatus(dto.getStatus());
        serviceRequest.setVehicle(vehicle);
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




