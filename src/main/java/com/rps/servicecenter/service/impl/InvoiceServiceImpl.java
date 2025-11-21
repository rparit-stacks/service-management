package com.rps.servicecenter.service.impl;

import com.rps.servicecenter.dto.InvoiceRequestDTO;
import com.rps.servicecenter.dto.InvoiceResponseDTO;
import com.rps.servicecenter.exception.ResourceNotFoundException;
import com.rps.servicecenter.mapper.InvoiceMapper;
import com.rps.servicecenter.model.Invoice;
import com.rps.servicecenter.model.Service;
import com.rps.servicecenter.model.ServiceRequest;
import com.rps.servicecenter.repository.InvoiceRepository;
import com.rps.servicecenter.repository.ServiceRequestRepository;
import com.rps.servicecenter.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDTO> getAllInvoices() {
        // findAll() uses @EntityGraph to eagerly fetch all relationships
        // This prevents N+1 queries
        return invoiceRepository.findAll().stream()
                .map(invoiceMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public InvoiceResponseDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", id));
        return invoiceMapper.toResponseDTO(invoice);
    }

    @Override
    public InvoiceResponseDTO getInvoiceByNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new RuntimeException("Invoice not found with number: " + invoiceNumber));
        return invoiceMapper.toResponseDTO(invoice);
    }

    @Override
    public InvoiceResponseDTO createInvoice(InvoiceRequestDTO invoiceRequestDTO) {
        ServiceRequest serviceRequest = serviceRequestRepository.findById(invoiceRequestDTO.getServiceRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", invoiceRequestDTO.getServiceRequestId()));

        // Check if invoice already exists for this service request
        List<Invoice> existingInvoices = invoiceRepository.findByServiceRequestId(serviceRequest.getId());
        if (!existingInvoices.isEmpty()) {
            throw new RuntimeException("Invoice already exists for this service request");
        }

        // Calculate subtotal from services
        double subtotal = 0.0;
        if (serviceRequest.getJobs() != null) {
            subtotal = serviceRequest.getJobs().stream()
                    .mapToDouble(Service::getCost)
                    .sum();
        }

        // Calculate total (tax and discount are percentages)
        double taxPercent = invoiceRequestDTO.getTax() != null ? invoiceRequestDTO.getTax() : 0.0;
        double discountPercent = invoiceRequestDTO.getDiscount() != null ? invoiceRequestDTO.getDiscount() : 0.0;
        double taxAmount = (subtotal * taxPercent) / 100.0;
        double discountAmount = (subtotal * discountPercent) / 100.0;
        double totalAmount = subtotal + taxAmount - discountAmount;

        // Generate unique invoice number
        String invoiceNumber = generateInvoiceNumber();

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setServiceRequest(serviceRequest);
        invoice.setCustomer(serviceRequest.getVehicle().getCustomer());
        invoice.setVehicle(serviceRequest.getVehicle());
        invoice.setSubtotal(subtotal);
        invoice.setTax(taxAmount);
        invoice.setDiscount(discountAmount);
        invoice.setTotalAmount(totalAmount);
        invoice.setPaymentStatus(invoiceRequestDTO.getPaymentStatus() != null ? 
                invoiceRequestDTO.getPaymentStatus() : "UNPAID");
        invoice.setNotes(invoiceRequestDTO.getNotes());
        invoice.setCreatedAt(LocalDateTime.now());
        
        if (invoiceRequestDTO.getDueDays() != null && invoiceRequestDTO.getDueDays() > 0) {
            invoice.setDueDate(LocalDateTime.now().plusDays(invoiceRequestDTO.getDueDays()));
        }

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return invoiceMapper.toResponseDTO(savedInvoice);
    }

    @Override
    public InvoiceResponseDTO updateInvoice(Long id, InvoiceRequestDTO invoiceRequestDTO) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", id));

        // Recalculate if service request changed
        if (!invoice.getServiceRequest().getId().equals(invoiceRequestDTO.getServiceRequestId())) {
            ServiceRequest serviceRequest = serviceRequestRepository.findById(invoiceRequestDTO.getServiceRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", invoiceRequestDTO.getServiceRequestId()));
            
            double subtotal = 0.0;
            if (serviceRequest.getJobs() != null) {
                subtotal = serviceRequest.getJobs().stream()
                        .mapToDouble(Service::getCost)
                        .sum();
            }
            
            invoice.setServiceRequest(serviceRequest);
            invoice.setCustomer(serviceRequest.getVehicle().getCustomer());
            invoice.setVehicle(serviceRequest.getVehicle());
            invoice.setSubtotal(subtotal);
        }

        double taxPercent = invoiceRequestDTO.getTax() != null ? invoiceRequestDTO.getTax() : 0.0;
        double discountPercent = invoiceRequestDTO.getDiscount() != null ? invoiceRequestDTO.getDiscount() : 0.0;
        double taxAmount = (invoice.getSubtotal() * taxPercent) / 100.0;
        double discountAmount = (invoice.getSubtotal() * discountPercent) / 100.0;
        invoice.setTax(taxAmount);
        invoice.setDiscount(discountAmount);
        invoice.setTotalAmount(invoice.getSubtotal() + taxAmount - discountAmount);
        invoice.setPaymentStatus(invoiceRequestDTO.getPaymentStatus() != null ? 
                invoiceRequestDTO.getPaymentStatus() : invoice.getPaymentStatus());
        invoice.setNotes(invoiceRequestDTO.getNotes());
        
        if (invoiceRequestDTO.getDueDays() != null && invoiceRequestDTO.getDueDays() > 0) {
            invoice.setDueDate(LocalDateTime.now().plusDays(invoiceRequestDTO.getDueDays()));
        }

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return invoiceMapper.toResponseDTO(updatedInvoice);
    }

    @Override
    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", id));
        invoiceRepository.delete(invoice);
    }

    @Override
    public List<InvoiceResponseDTO> getInvoicesByCustomerId(Long customerId) {
        return invoiceRepository.findByCustomerId(customerId).stream()
                .map(invoiceMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<InvoiceResponseDTO> getInvoicesByPaymentStatus(String paymentStatus) {
        return invoiceRepository.findAll().stream()
                .filter(inv -> paymentStatus.equals(inv.getPaymentStatus()))
                .map(invoiceMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    private String generateInvoiceNumber() {
        String prefix = "INV";
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(7);
        String uniqueId = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return prefix + "-" + timestamp + "-" + uniqueId;
    }
}

