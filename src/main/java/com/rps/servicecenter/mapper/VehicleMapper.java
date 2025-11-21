package com.rps.servicecenter.mapper;

import com.rps.servicecenter.dto.VehicleRequestDTO;
import com.rps.servicecenter.dto.VehicleResponseDTO;
import com.rps.servicecenter.model.Brand;
import com.rps.servicecenter.model.Customer;
import com.rps.servicecenter.model.Vehicle;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    public Vehicle toEntity(VehicleRequestDTO dto, Customer customer, Brand brand) {
        Vehicle vehicle = new Vehicle();
        vehicle.setNumber(dto.getNumber());
        vehicle.setModel(dto.getModel());
        vehicle.setType(dto.getType());
        vehicle.setCustomer(customer);
        vehicle.setBrand(brand);
        return vehicle;
    }

    public VehicleResponseDTO toResponseDTO(Vehicle vehicle) {
        VehicleResponseDTO dto = new VehicleResponseDTO();
        dto.setId(vehicle.getId());
        dto.setNumber(vehicle.getNumber());
        dto.setModel(vehicle.getModel());
        dto.setType(vehicle.getType());
        
        if (vehicle.getCustomer() != null) {
            dto.setCustomerId(vehicle.getCustomer().getId());
            dto.setCustomerName(vehicle.getCustomer().getFullName());
        }
        
        if (vehicle.getBrand() != null) {
            dto.setBrandId(vehicle.getBrand().getId());
            dto.setBrandName(vehicle.getBrand().getName());
        }
        
        return dto;
    }

    public void updateEntityFromDTO(VehicleRequestDTO dto, Vehicle vehicle, Customer customer, Brand brand) {
        vehicle.setNumber(dto.getNumber());
        vehicle.setModel(dto.getModel());
        vehicle.setType(dto.getType());
        vehicle.setCustomer(customer);
        vehicle.setBrand(brand);
    }
}

