package com.rps.servicecenter.mapper;

import com.rps.servicecenter.dto.InvoiceResponseDTO;
import com.rps.servicecenter.dto.ServiceResponseDTO;
import com.rps.servicecenter.model.Invoice;
import com.rps.servicecenter.model.Service;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class InvoiceMapper {

    public InvoiceResponseDTO toResponseDTO(Invoice invoice) {
        InvoiceResponseDTO dto = new InvoiceResponseDTO();
        dto.setId(invoice.getId());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        
        if (invoice.getServiceRequest() != null) {
            dto.setServiceRequestId(invoice.getServiceRequest().getId());
            dto.setServiceRequestDescription(invoice.getServiceRequest().getDescription());
            
            // Map services from service request
            if (invoice.getServiceRequest().getJobs() != null) {
                List<ServiceResponseDTO> serviceDTOs = invoice.getServiceRequest().getJobs().stream()
                        .map(this::toServiceResponseDTO)
                        .collect(Collectors.toList());
                dto.setServices(serviceDTOs);
            }
        }
        
        if (invoice.getCustomer() != null) {
            dto.setCustomerId(invoice.getCustomer().getId());
            dto.setCustomerName(invoice.getCustomer().getFullName());
            dto.setCustomerEmail(invoice.getCustomer().getEmail());
            dto.setCustomerPhone(invoice.getCustomer().getPhone());
        }
        
        if (invoice.getVehicle() != null) {
            dto.setVehicleId(invoice.getVehicle().getId());
            dto.setVehicleNumber(invoice.getVehicle().getNumber());
            dto.setVehicleModel(invoice.getVehicle().getModel());
            dto.setVehicleType(invoice.getVehicle().getType());
        }
        
        dto.setSubtotal(invoice.getSubtotal());
        dto.setTax(invoice.getTax());
        dto.setDiscount(invoice.getDiscount());
        dto.setTotalAmount(invoice.getTotalAmount());
        dto.setPaymentStatus(invoice.getPaymentStatus());
        dto.setNotes(invoice.getNotes());
        dto.setCreatedAt(invoice.getCreatedAt());
        dto.setDueDate(invoice.getDueDate());
        
        return dto;
    }

    private ServiceResponseDTO toServiceResponseDTO(Service service) {
        ServiceResponseDTO dto = new ServiceResponseDTO();
        dto.setId(service.getId());
        dto.setJobName(service.getJobName());
        dto.setDescription(service.getDescription());
        dto.setCost(service.getCost());
        if (service.getUser() != null) {
            dto.setUserId(service.getUser().getId());
            dto.setUserName(service.getUser().getFullName());
        }
        return dto;
    }
}

