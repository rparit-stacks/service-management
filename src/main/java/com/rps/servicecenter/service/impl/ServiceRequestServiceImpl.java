package com.rps.servicecenter.service.impl;

import com.rps.servicecenter.dto.InvoiceRequestDTO;
import com.rps.servicecenter.dto.ServiceRequestDTO;
import com.rps.servicecenter.dto.ServiceRequestResponseDTO;
import com.rps.servicecenter.exception.ResourceNotFoundException;
import com.rps.servicecenter.mapper.ServiceRequestMapper;
import com.rps.servicecenter.model.ServiceRequest;
import com.rps.servicecenter.model.Vehicle;
import com.rps.servicecenter.repository.InvoiceRepository;
import com.rps.servicecenter.repository.ServiceRequestRepository;
import com.rps.servicecenter.repository.VehicleRepository;
import com.rps.servicecenter.service.InvoiceService;
import com.rps.servicecenter.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServiceRequestServiceImpl implements ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ServiceRequestMapper serviceRequestMapper;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestResponseDTO> getAllServiceRequests() {
        return serviceRequestRepository.findAll().stream()
                .map(serviceRequestMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceRequestResponseDTO getServiceRequestById(Long id) {
        ServiceRequest serviceRequest = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", id));
        return serviceRequestMapper.toResponseDTO(serviceRequest);
    }

    @Override
    public ServiceRequestResponseDTO saveServiceRequest(ServiceRequestDTO serviceRequestDTO) {
        Vehicle vehicle = vehicleRepository.findById(serviceRequestDTO.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", serviceRequestDTO.getVehicleId()));
        
        ServiceRequest serviceRequest = serviceRequestMapper.toEntity(serviceRequestDTO, vehicle);
        ServiceRequest savedServiceRequest = serviceRequestRepository.save(serviceRequest);
        return serviceRequestMapper.toResponseDTO(savedServiceRequest);
    }

    @Override
    public ServiceRequestResponseDTO updateServiceRequest(Long id, ServiceRequestDTO serviceRequestDTO) {
        ServiceRequest existingServiceRequest = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", id));
        
        String oldStatus = existingServiceRequest.getStatus();
        
        Vehicle vehicle = vehicleRepository.findById(serviceRequestDTO.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", serviceRequestDTO.getVehicleId()));
        
        serviceRequestMapper.updateEntityFromDTO(serviceRequestDTO, existingServiceRequest, vehicle);
        ServiceRequest updatedServiceRequest = serviceRequestRepository.save(existingServiceRequest);
        
        // Auto-generate invoice when status changes to COMPLETED
        if (!"COMPLETED".equals(oldStatus) && "COMPLETED".equals(serviceRequestDTO.getStatus())) {
            autoGenerateInvoice(updatedServiceRequest);
        }
        
        return serviceRequestMapper.toResponseDTO(updatedServiceRequest);
    }

    private void autoGenerateInvoice(ServiceRequest serviceRequest) {
        // Check if invoice already exists for this service request
        if (!invoiceRepository.findByServiceRequestId(serviceRequest.getId()).isEmpty()) {
            return; // Invoice already exists
        }

        // Check if service request has services
        if (serviceRequest.getJobs() == null || serviceRequest.getJobs().isEmpty()) {
            return; // No services to invoice
        }

        // Create invoice automatically
        InvoiceRequestDTO invoiceRequest = new InvoiceRequestDTO();
        invoiceRequest.setServiceRequestId(serviceRequest.getId());
        invoiceRequest.setTax(0.0);
        invoiceRequest.setDiscount(0.0);
        invoiceRequest.setPaymentStatus("UNPAID");
        invoiceRequest.setDueDays(30);
        invoiceRequest.setNotes("Auto-generated invoice for completed service request");

        try {
            invoiceService.createInvoice(invoiceRequest);
        } catch (Exception e) {
            // Log error but don't fail the service request update
            System.err.println("Failed to auto-generate invoice: " + e.getMessage());
        }
    }

    @Override
    public void deleteServiceRequest(Long id) {
        if (!serviceRequestRepository.existsById(id)) {
            throw new ResourceNotFoundException("ServiceRequest", id);
        }
        serviceRequestRepository.deleteById(id);
    }
}

