package com.rps.servicecenter.mapper;

import com.rps.servicecenter.dto.ServiceTemplateRequestDTO;
import com.rps.servicecenter.dto.ServiceTemplateResponseDTO;
import com.rps.servicecenter.model.ServiceTemplate;
import org.springframework.stereotype.Component;

@Component
public class ServiceTemplateMapper {

    public ServiceTemplate toEntity(ServiceTemplateRequestDTO dto) {
        ServiceTemplate template = new ServiceTemplate();
        template.setName(dto.getName());
        template.setDescription(dto.getDescription());
        template.setDefaultCost(dto.getDefaultCost());
        template.setActive(dto.getActive() != null ? dto.getActive() : true);
        return template;
    }

    public ServiceTemplateResponseDTO toResponseDTO(ServiceTemplate template) {
        return new ServiceTemplateResponseDTO(
                template.getId(),
                template.getName(),
                template.getDescription(),
                template.getDefaultCost(),
                template.getActive()
        );
    }

    public void updateEntityFromDTO(ServiceTemplateRequestDTO dto, ServiceTemplate template) {
        template.setName(dto.getName());
        template.setDescription(dto.getDescription());
        template.setDefaultCost(dto.getDefaultCost());
        if (dto.getActive() != null) {
            template.setActive(dto.getActive());
        }
    }
}

