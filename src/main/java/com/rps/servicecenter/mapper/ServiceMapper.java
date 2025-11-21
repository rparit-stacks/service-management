package com.rps.servicecenter.mapper;

import com.rps.servicecenter.dto.ServiceDTO;
import com.rps.servicecenter.dto.ServiceResponseDTO;
import com.rps.servicecenter.model.Service;
import com.rps.servicecenter.model.ServiceRequest;
import com.rps.servicecenter.model.ServiceTemplate;
import com.rps.servicecenter.model.User;
import com.rps.servicecenter.repository.ServiceTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ServiceMapper {

    @Autowired
    private ServiceTemplateRepository serviceTemplateRepository;

    public Service toEntity(ServiceDTO dto, ServiceRequest serviceRequest, User user) {
        Service service = new Service();
        service.setDescription(dto.getDescription());
        service.setJobName(dto.getJobName());
        service.setCost(dto.getCost());
        service.setServiceRequest(serviceRequest);
        service.setUser(user);
        
        // Set service template if provided
        if (dto.getServiceTemplateId() != null) {
            ServiceTemplate template = serviceTemplateRepository.findById(dto.getServiceTemplateId())
                    .orElse(null);
            service.setServiceTemplate(template);
        }
        
        return service;
    }

    public ServiceResponseDTO toResponseDTO(Service service) {
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
        
        if (service.getServiceTemplate() != null) {
            dto.setServiceTemplateId(service.getServiceTemplate().getId());
            dto.setServiceTemplateName(service.getServiceTemplate().getName());
        }
        
        return dto;
    }

    public void updateEntityFromDTO(ServiceDTO dto, Service service, ServiceRequest serviceRequest, User user) {
        service.setDescription(dto.getDescription());
        service.setJobName(dto.getJobName());
        service.setCost(dto.getCost());
        service.setServiceRequest(serviceRequest);
        service.setUser(user);
        
        // Update service template if provided
        if (dto.getServiceTemplateId() != null) {
            ServiceTemplate template = serviceTemplateRepository.findById(dto.getServiceTemplateId())
                    .orElse(null);
            service.setServiceTemplate(template);
        } else {
            service.setServiceTemplate(null);
        }
    }
}




