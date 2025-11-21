package com.rps.servicecenter.controller;

import com.rps.servicecenter.dto.ServiceDTO;
import com.rps.servicecenter.dto.ServiceResponseDTO;
import com.rps.servicecenter.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<ServiceResponseDTO>> getAllServices() {
        List<ServiceResponseDTO> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponseDTO> getServiceById(@PathVariable Long id) {
        ServiceResponseDTO service = serviceService.getServiceById(id);
        return ResponseEntity.ok(service);
    }

    @PostMapping
    public ResponseEntity<ServiceResponseDTO> createService(@Valid @RequestBody ServiceDTO serviceDTO) {
        ServiceResponseDTO savedService = serviceService.saveService(serviceDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedService);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponseDTO> updateService(@PathVariable Long id, @Valid @RequestBody ServiceDTO serviceDTO) {
        ServiceResponseDTO updatedService = serviceService.updateService(id, serviceDTO);
        return ResponseEntity.ok(updatedService);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}

