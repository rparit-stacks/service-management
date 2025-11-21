package com.rps.servicecenter.controller;

import com.rps.servicecenter.dto.VehicleRequestDTO;
import com.rps.servicecenter.dto.VehicleResponseDTO;
import com.rps.servicecenter.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<VehicleResponseDTO>> getAllVehicles() {
        List<VehicleResponseDTO> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponseDTO> getVehicleById(@PathVariable Long id) {
        VehicleResponseDTO vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(vehicle);
    }

    @PostMapping
    public ResponseEntity<VehicleResponseDTO> createVehicle(@Valid @RequestBody VehicleRequestDTO vehicleRequestDTO) {
        VehicleResponseDTO savedVehicle = vehicleService.saveVehicle(vehicleRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVehicle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponseDTO> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequestDTO vehicleRequestDTO) {
        VehicleResponseDTO updatedVehicle = vehicleService.updateVehicle(id, vehicleRequestDTO);
        return ResponseEntity.ok(updatedVehicle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}

