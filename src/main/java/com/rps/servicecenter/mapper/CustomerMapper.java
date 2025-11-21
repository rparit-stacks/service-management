package com.rps.servicecenter.mapper;

import com.rps.servicecenter.dto.CustomerRequestDTO;
import com.rps.servicecenter.dto.CustomerResponseDTO;
import com.rps.servicecenter.dto.VehicleResponseDTO;
import com.rps.servicecenter.model.Customer;
import com.rps.servicecenter.model.Vehicle;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CustomerMapper {

    public Customer toEntity(CustomerRequestDTO dto) {
        Customer customer = new Customer();
        customer.setFullName(dto.getFullName());
        customer.setPhone(dto.getPhone());
        customer.setEmail(dto.getEmail());
        return customer;
    }

    public CustomerResponseDTO toResponseDTO(Customer customer) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(customer.getId());
        dto.setFullName(customer.getFullName());
        dto.setPhone(customer.getPhone());
        dto.setEmail(customer.getEmail());
        
        // Only load vehicles if they're already fetched (to avoid N+1 queries)
        // For list views, we typically don't need vehicles
        // Uncomment below if vehicles are needed:
        /*
        if (customer.getVehicles() != null && !customer.getVehicles().isEmpty()) {
            List<VehicleResponseDTO> vehicleDTOs = customer.getVehicles().stream()
                    .map(this::toVehicleResponseDTO)
                    .collect(Collectors.toList());
            dto.setVehicles(vehicleDTOs);
        }
        */
        
        return dto;
    }

    public void updateEntityFromDTO(CustomerRequestDTO dto, Customer customer) {
        customer.setFullName(dto.getFullName());
        customer.setPhone(dto.getPhone());
        customer.setEmail(dto.getEmail());
    }

    private VehicleResponseDTO toVehicleResponseDTO(Vehicle vehicle) {
        VehicleResponseDTO dto = new VehicleResponseDTO();
        dto.setId(vehicle.getId());
        dto.setNumber(vehicle.getNumber());
        dto.setModel(vehicle.getModel());
        dto.setType(vehicle.getType());
        if (vehicle.getCustomer() != null) {
            dto.setCustomerId(vehicle.getCustomer().getId());
            dto.setCustomerName(vehicle.getCustomer().getFullName());
        }
        return dto;
    }
}


