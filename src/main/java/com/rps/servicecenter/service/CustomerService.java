package com.rps.servicecenter.service;

import com.rps.servicecenter.dto.CustomerRequestDTO;
import com.rps.servicecenter.dto.CustomerResponseDTO;

import java.util.List;

public interface CustomerService {
    List<CustomerResponseDTO> getAllCustomers();
    CustomerResponseDTO getCustomerById(Long id);
    CustomerResponseDTO saveCustomer(CustomerRequestDTO customerRequestDTO);
    CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO customerRequestDTO);
    void deleteCustomer(Long id);
}

