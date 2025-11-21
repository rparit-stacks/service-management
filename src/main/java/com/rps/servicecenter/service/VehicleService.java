package com.rps.servicecenter.service;

import com.rps.servicecenter.dto.VehicleRequestDTO;
import com.rps.servicecenter.dto.VehicleResponseDTO;

import java.util.List;

public interface VehicleService {
    List<VehicleResponseDTO> getAllVehicles();
    VehicleResponseDTO getVehicleById(Long id);
    VehicleResponseDTO saveVehicle(VehicleRequestDTO vehicleRequestDTO);
    VehicleResponseDTO updateVehicle(Long id, VehicleRequestDTO vehicleRequestDTO);
    void deleteVehicle(Long id);
}

