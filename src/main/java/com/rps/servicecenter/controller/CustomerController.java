package com.rps.servicecenter.controller;

import com.rps.servicecenter.dto.CustomerRequestDTO;
import com.rps.servicecenter.dto.CustomerResponseDTO;
import com.rps.servicecenter.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Customer Controller
 * 
 * IMPORTANT: Customer is a DATA entity only - NO authentication
 * - Customers cannot login (they have no password field)
 * - Only authenticated users (USER or ADMIN roles) can manage customers
 * - Customers are service center clients, not system users
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {
        List<CustomerResponseDTO> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable Long id) {
        CustomerResponseDTO customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    @PostMapping
    public ResponseEntity<CustomerResponseDTO> createCustomer(@Valid @RequestBody CustomerRequestDTO customerRequestDTO) {
        CustomerResponseDTO savedCustomer = customerService.saveCustomer(customerRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerRequestDTO customerRequestDTO) {
        CustomerResponseDTO updatedCustomer = customerService.updateCustomer(id, customerRequestDTO);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}

