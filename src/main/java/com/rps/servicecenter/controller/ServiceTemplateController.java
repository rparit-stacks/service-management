package com.rps.servicecenter.controller;

import com.rps.servicecenter.dto.ServiceTemplateRequestDTO;
import com.rps.servicecenter.dto.ServiceTemplateResponseDTO;
import com.rps.servicecenter.service.ServiceTemplateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-templates")
public class ServiceTemplateController {

    @Autowired
    private ServiceTemplateService templateService;

    @GetMapping
    public ResponseEntity<List<ServiceTemplateResponseDTO>> getAllTemplates() {
        List<ServiceTemplateResponseDTO> templates = templateService.getAllTemplates();
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/active")
    public ResponseEntity<List<ServiceTemplateResponseDTO>> getActiveTemplates() {
        List<ServiceTemplateResponseDTO> templates = templateService.getActiveTemplates();
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceTemplateResponseDTO> getTemplateById(@PathVariable Long id) {
        ServiceTemplateResponseDTO template = templateService.getTemplateById(id);
        return ResponseEntity.ok(template);
    }

    @PostMapping
    public ResponseEntity<ServiceTemplateResponseDTO> createTemplate(@Valid @RequestBody ServiceTemplateRequestDTO dto) {
        ServiceTemplateResponseDTO createdTemplate = templateService.createTemplate(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTemplate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceTemplateResponseDTO> updateTemplate(
            @PathVariable Long id,
            @Valid @RequestBody ServiceTemplateRequestDTO dto) {
        ServiceTemplateResponseDTO updatedTemplate = templateService.updateTemplate(id, dto);
        return ResponseEntity.ok(updatedTemplate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }
}

