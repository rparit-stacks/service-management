import React, { useState, useEffect } from 'react';
import { vehicleAPI, customerAPI } from '../../services/api';
import VehicleForm from './VehicleForm';
import './Vehicles.css';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vehiclesRes, customersRes] = await Promise.all([
        vehicleAPI.getAll(),
        customerAPI.getAll(),
      ]);
      setVehicles(vehiclesRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Failed to delete vehicle');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVehicle(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner"></i>
        Loading vehicles...
      </div>
    );
  }

  return (
    <div className="vehicles">
      <div className="page-header">
        <h1>
          <i className="fas fa-car"></i>
          Vehicles
        </h1>
        <button className="btn-primary" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Add Vehicle
        </button>
      </div>

      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          customers={customers}
          onClose={handleFormClose}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle Number</th>
              <th>Model</th>
              <th>Type</th>
              <th>Customer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <i className="fas fa-inbox"></i>
                  No vehicles found. Create your first vehicle!
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <strong>{vehicle.id}</strong>
                  </td>
                  <td>{vehicle.number}</td>
                  <td>{vehicle.model || 'N/A'}</td>
                  <td>{vehicle.type || 'N/A'}</td>
                  <td>
                    {vehicle.customerName || 'N/A'}
                    {vehicle.customerId && (
                      <>
                        <br />
                        <small style={{ color: '#757575' }}>Customer ID: {vehicle.customerId}</small>
                      </>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicles;

