import React, { useState, useEffect } from 'react';
import { serviceAPI, serviceRequestAPI, vehicleAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ServiceForm from './ServiceForm';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesRes, serviceRequestsRes, vehiclesRes] = await Promise.all([
        serviceAPI.getAll(),
        serviceRequestAPI.getAll(),
        vehicleAPI.getAll(),
      ]);
      setServices(servicesRes.data);
      setServiceRequests(serviceRequestsRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service/job?')) {
      try {
        await serviceAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingService(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner"></i>
        Loading services...
      </div>
    );
  }

  return (
    <div className="services">
      <div className="page-header">
        <h1>
          <i className="fas fa-tools"></i>
          Services / Jobs
        </h1>
        <button className="btn-primary" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Add Service/Job
        </button>
      </div>

      {showForm && (
        <ServiceForm
          service={editingService}
          serviceRequests={serviceRequests}
          userId={user?.id}
          allServices={services}
          onClose={handleFormClose}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Job Name</th>
              <th>Description</th>
              <th>Cost</th>
              <th>Service Request</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <i className="fas fa-inbox"></i>
                  No services/jobs found. Create your first service!
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <strong>{service.id}</strong>
                  </td>
                  <td>{service.jobName}</td>
                  <td>{service.description || 'N/A'}</td>
                  <td>₹{service.cost?.toFixed(2) || '0.00'}</td>
                  <td>
                    Request #{service.serviceRequestId}
                    {service.userId && (
                      <>
                        <br />
                        <small style={{ color: '#757575' }}>User ID: {service.userId}</small>
                      </>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(service)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(service.id)}
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

export default Services;

