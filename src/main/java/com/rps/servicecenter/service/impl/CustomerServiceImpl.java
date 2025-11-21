package com.rps.servicecenter.service.impl;

import com.rps.servicecenter.dto.CustomerRequestDTO;
import com.rps.servicecenter.dto.CustomerResponseDTO;
import com.rps.servicecenter.exception.ResourceNotFoundException;
import com.rps.servicecenter.mapper.CustomerMapper;
import com.rps.servicecenter.model.Customer;
import com.rps.servicecenter.repository.CustomerRepository;
import com.rps.servicecenter.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerMapper customerMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponseDTO> getAllCustomers() {
        //select * from customer
        return customerRepository.findAll().stream()
                .map(customerMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
        return customerMapper.toResponseDTO(customer);
    }

    @Override
    public CustomerResponseDTO saveCustomer(CustomerRequestDTO customerRequestDTO) {
        Customer customer = customerMapper.toEntity(customerRequestDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.toResponseDTO(savedCustomer);
    }

    @Override
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO customerRequestDTO) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
        
        customerMapper.updateEntityFromDTO(customerRequestDTO, existingCustomer);
        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return customerMapper.toResponseDTO(updatedCustomer);
    }

    @Override
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer", id);
        }
        customerRepository.deleteById(id);
    }
}

