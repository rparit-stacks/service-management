package com.rps.servicecenter.service;

import com.rps.servicecenter.dto.InvoiceRequestDTO;
import com.rps.servicecenter.dto.InvoiceResponseDTO;

import java.util.List;

public interface InvoiceService {
    List<InvoiceResponseDTO> getAllInvoices();
    InvoiceResponseDTO getInvoiceById(Long id);
    InvoiceResponseDTO getInvoiceByNumber(String invoiceNumber);
    InvoiceResponseDTO createInvoice(InvoiceRequestDTO invoiceRequestDTO);
    InvoiceResponseDTO updateInvoice(Long id, InvoiceRequestDTO invoiceRequestDTO);
    void deleteInvoice(Long id);
    List<InvoiceResponseDTO> getInvoicesByCustomerId(Long customerId);
    List<InvoiceResponseDTO> getInvoicesByPaymentStatus(String paymentStatus);
}

