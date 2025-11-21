package com.rps.servicecenter.service;

import com.rps.servicecenter.dto.ServiceTemplateRequestDTO;
import com.rps.servicecenter.dto.ServiceTemplateResponseDTO;

import java.util.List;

public interface ServiceTemplateService {
    List<ServiceTemplateResponseDTO> getAllTemplates();
    List<ServiceTemplateResponseDTO> getActiveTemplates();
    ServiceTemplateResponseDTO getTemplateById(Long id);
    ServiceTemplateResponseDTO createTemplate(ServiceTemplateRequestDTO dto);
    ServiceTemplateResponseDTO updateTemplate(Long id, ServiceTemplateRequestDTO dto);
    void deleteTemplate(Long id);
}

