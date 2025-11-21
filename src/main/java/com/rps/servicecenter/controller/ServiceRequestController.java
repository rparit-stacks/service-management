package com.rps.servicecenter.controller;

import com.rps.servicecenter.dto.ServiceRequestDTO;
import com.rps.servicecenter.dto.ServiceRequestResponseDTO;
import com.rps.servicecenter.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-requests")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @GetMapping
    public ResponseEntity<List<ServiceRequestResponseDTO>> getAllServiceRequests() {
        List<ServiceRequestResponseDTO> serviceRequests = serviceRequestService.getAllServiceRequests();
        return ResponseEntity.ok(serviceRequests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestResponseDTO> getServiceRequestById(@PathVariable Long id) {
        ServiceRequestResponseDTO serviceRequest = serviceRequestService.getServiceRequestById(id);
        return ResponseEntity.ok(serviceRequest);
    }

    @PostMapping
    public ResponseEntity<ServiceRequestResponseDTO> createServiceRequest(@Valid @RequestBody ServiceRequestDTO serviceRequestDTO) {
        ServiceRequestResponseDTO savedServiceRequest = serviceRequestService.saveServiceRequest(serviceRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedServiceRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceRequestResponseDTO> updateServiceRequest(@PathVariable Long id, @Valid @RequestBody ServiceRequestDTO serviceRequestDTO) {
        ServiceRequestResponseDTO updatedServiceRequest = serviceRequestService.updateServiceRequest(id, serviceRequestDTO);
        return ResponseEntity.ok(updatedServiceRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServiceRequest(@PathVariable Long id) {
        serviceRequestService.deleteServiceRequest(id);
        return ResponseEntity.noContent().build();
    }
}

