package com.rps.servicecenter.service.impl;

import com.rps.servicecenter.dto.ServiceTemplateRequestDTO;
import com.rps.servicecenter.dto.ServiceTemplateResponseDTO;
import com.rps.servicecenter.exception.ResourceNotFoundException;
import com.rps.servicecenter.mapper.ServiceTemplateMapper;
import com.rps.servicecenter.model.ServiceTemplate;
import com.rps.servicecenter.repository.ServiceTemplateRepository;
import com.rps.servicecenter.service.ServiceTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServiceTemplateServiceImpl implements ServiceTemplateService {

    @Autowired
    private ServiceTemplateRepository templateRepository;

    @Autowired
    private ServiceTemplateMapper templateMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ServiceTemplateResponseDTO> getAllTemplates() {
        return templateRepository.findAll().stream()
                .map(templateMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceTemplateResponseDTO> getActiveTemplates() {
        return templateRepository.findByActiveTrue().stream()
                .map(templateMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceTemplateResponseDTO getTemplateById(Long id) {
        ServiceTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceTemplate", id));
        return templateMapper.toResponseDTO(template);
    }

    @Override
    public ServiceTemplateResponseDTO createTemplate(ServiceTemplateRequestDTO dto) {
        if (templateRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Service template with name '" + dto.getName() + "' already exists");
        }
        ServiceTemplate template = templateMapper.toEntity(dto);
        ServiceTemplate savedTemplate = templateRepository.save(template);
        return templateMapper.toResponseDTO(savedTemplate);
    }

    @Override
    public ServiceTemplateResponseDTO updateTemplate(Long id, ServiceTemplateRequestDTO dto) {
        ServiceTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceTemplate", id));
        
        // Check if name is being changed and if new name already exists
        if (!template.getName().equals(dto.getName()) && templateRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Service template with name '" + dto.getName() + "' already exists");
        }
        
        templateMapper.updateEntityFromDTO(dto, template);
        ServiceTemplate updatedTemplate = templateRepository.save(template);
        return templateMapper.toResponseDTO(updatedTemplate);
    }

    @Override
    public void deleteTemplate(Long id) {
        ServiceTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceTemplate", id));
        templateRepository.delete(template);
    }
}

