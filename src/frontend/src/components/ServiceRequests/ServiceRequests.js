import React, { useState, useEffect } from 'react';
import { serviceRequestAPI, vehicleAPI } from '../../services/api';
import ServiceRequestForm from './ServiceRequestForm';
import CreateServiceWizard from './CreateServiceWizard';
import './ServiceRequests.css';

const ServiceRequests = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [editingServiceRequest, setEditingServiceRequest] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [serviceRequestsRes, vehiclesRes] = await Promise.all([
        serviceRequestAPI.getAll(),
        vehicleAPI.getAll(),
      ]);
      setServiceRequests(serviceRequestsRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowWizard(true);
  };

  const handleCreateOld = () => {
    setEditingServiceRequest(null);
    setShowForm(true);
  };

  const handleEdit = (serviceRequest) => {
    setEditingServiceRequest(serviceRequest);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service request?')) {
      try {
        await serviceRequestAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting service request:', error);
        alert('Failed to delete service request');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingServiceRequest(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner"></i>
        Loading service requests...
      </div>
    );
  }

  return (
    <div className="service-requests">
      <div className="page-header">
        <h1>
          <i className="fas fa-clipboard-list"></i>
          Service Requests
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={handleCreate}>
            <i className="fas fa-plus"></i>
            Create New Service
          </button>
          <button className="btn-secondary" onClick={handleCreateOld}>
            <i className="fas fa-file-alt"></i>
            Create Service Request (Old)
          </button>
        </div>
      </div>

      {showWizard && (
        <CreateServiceWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            loadData();
          }}
        />
      )}

      {showForm && (
        <ServiceRequestForm
          serviceRequest={editingServiceRequest}
          vehicles={vehicles}
          onClose={handleFormClose}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Description</th>
              <th>Status</th>
              <th>Jobs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <i className="fas fa-inbox"></i>
                  No service requests found. Create your first service request!
                </td>
              </tr>
            ) : (
              serviceRequests.map((sr) => (
                <tr key={sr.id}>
                  <td>
                    <strong>{sr.id}</strong>
                  </td>
                  <td>
                    {sr.vehicleNumber}
                    {sr.vehicleId && (
                      <>
                        <br />
                        <small style={{ color: '#757575' }}>Vehicle ID: {sr.vehicleId}</small>
                      </>
                    )}
                  </td>
                  <td>{sr.description || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${sr.status?.toLowerCase()}`}>
                      {sr.status}
                    </span>
                  </td>
                  <td>{sr.jobs?.length || 0}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(sr)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(sr.id)}
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

export default ServiceRequests;

