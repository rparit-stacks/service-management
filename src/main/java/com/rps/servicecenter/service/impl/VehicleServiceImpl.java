package com.rps.servicecenter.service.impl;

import com.rps.servicecenter.dto.VehicleRequestDTO;
import com.rps.servicecenter.dto.VehicleResponseDTO;
import com.rps.servicecenter.exception.ResourceNotFoundException;
import com.rps.servicecenter.mapper.VehicleMapper;
import com.rps.servicecenter.model.Brand;
import com.rps.servicecenter.model.Customer;
import com.rps.servicecenter.model.Vehicle;
import com.rps.servicecenter.repository.BrandRepository;
import com.rps.servicecenter.repository.CustomerRepository;
import com.rps.servicecenter.repository.VehicleRepository;
import com.rps.servicecenter.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private VehicleMapper vehicleMapper;

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(vehicleMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponseDTO getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", id));
        return vehicleMapper.toResponseDTO(vehicle);
    }

    @Override
    public VehicleResponseDTO saveVehicle(VehicleRequestDTO vehicleRequestDTO) {
        Customer customer = customerRepository.findById(vehicleRequestDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", vehicleRequestDTO.getCustomerId()));
        
        Brand brand = null;
        if (vehicleRequestDTO.getBrandId() != null) {
            brand = brandRepository.findById(vehicleRequestDTO.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand", vehicleRequestDTO.getBrandId()));
        }
        
        Vehicle vehicle = vehicleMapper.toEntity(vehicleRequestDTO, customer, brand);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponseDTO(savedVehicle);
    }

    @Override
    public VehicleResponseDTO updateVehicle(Long id, VehicleRequestDTO vehicleRequestDTO) {
        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", id));
        
        Customer customer = customerRepository.findById(vehicleRequestDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", vehicleRequestDTO.getCustomerId()));
        
        Brand brand = null;
        if (vehicleRequestDTO.getBrandId() != null) {
            brand = brandRepository.findById(vehicleRequestDTO.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand", vehicleRequestDTO.getBrandId()));
        }
        
        vehicleMapper.updateEntityFromDTO(vehicleRequestDTO, existingVehicle, customer, brand);
        Vehicle updatedVehicle = vehicleRepository.save(existingVehicle);
        return vehicleMapper.toResponseDTO(updatedVehicle);
    }

    @Override
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle", id);
        }
        vehicleRepository.deleteById(id);
    }
}

