package com.rps.servicecenter.controller;

import com.rps.servicecenter.dto.InvoiceResponseDTO;
import com.rps.servicecenter.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class InvoicePrintController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/print/invoice/{id}")
    public String printInvoice(@PathVariable Long id, Model model) {
        InvoiceResponseDTO invoice = invoiceService.getInvoiceById(id);
        model.addAttribute("invoice", invoice);
        return "invoice-print";
    }

    @GetMapping("/print/invoice/number/{invoiceNumber}")
    public String printInvoiceByNumber(@PathVariable String invoiceNumber, Model model) {
        InvoiceResponseDTO invoice = invoiceService.getInvoiceByNumber(invoiceNumber);
        model.addAttribute("invoice", invoice);
        return "invoice-print";
    }
}




