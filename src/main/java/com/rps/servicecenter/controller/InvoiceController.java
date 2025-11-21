package com.rps.servicecenter.controller;

import com.rps.servicecenter.dto.InvoiceRequestDTO;
import com.rps.servicecenter.dto.InvoiceResponseDTO;
import com.rps.servicecenter.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<InvoiceResponseDTO>> getAllInvoices() {
        List<InvoiceResponseDTO> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceById(@PathVariable Long id) {
        InvoiceResponseDTO invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(invoice);
    }

    @GetMapping("/number/{invoiceNumber}")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        InvoiceResponseDTO invoice = invoiceService.getInvoiceByNumber(invoiceNumber);
        return ResponseEntity.ok(invoice);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoicesByCustomer(@PathVariable Long customerId) {
        List<InvoiceResponseDTO> invoices = invoiceService.getInvoicesByCustomerId(customerId);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoicesByPaymentStatus(@PathVariable String paymentStatus) {
        List<InvoiceResponseDTO> invoices = invoiceService.getInvoicesByPaymentStatus(paymentStatus);
        return ResponseEntity.ok(invoices);
    }

    @PostMapping
    public ResponseEntity<InvoiceResponseDTO> createInvoice(@Valid @RequestBody InvoiceRequestDTO invoiceRequestDTO) {
        InvoiceResponseDTO invoice = invoiceService.createInvoice(invoiceRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(invoice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceResponseDTO> updateInvoice(@PathVariable Long id, @Valid @RequestBody InvoiceRequestDTO invoiceRequestDTO) {
        InvoiceResponseDTO invoice = invoiceService.updateInvoice(id, invoiceRequestDTO);
        return ResponseEntity.ok(invoice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}

